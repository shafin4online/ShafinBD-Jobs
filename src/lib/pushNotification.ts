import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { firebaseConfig, db } from "./firebase";

export const VAPID_KEY = "BFWUlHzbzaC56w2UtAsxoxa_gI97nexu0bNfskqkAJj6-Fti898Ge8r4SpSmA3gFOKeVGXrj18PHkbofFnKHd-4";
export const NOTIFICATION_ICON = "https://lh3.googleusercontent.com/d/16e44uH8RVDhPCQtepuf_92JTg91rK0Az";

/**
 * Get Notification Permission Status safely
 */
export const getNotificationPermission = (): NotificationPermission | "unsupported" => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
};

/**
 * Request notification permission and save token to Firestore
 */
export const requestPushPermission = async (): Promise<{ success: boolean; token?: string; reason?: string }> => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return { success: false, reason: "ডিভাইস বা ব্রাউজারে নোটিফিকেশন সাপোর্ট করে না" };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { success: false, reason: "permission_denied" };
    }

    // Register Service Worker if needed
    let swRegistration: ServiceWorkerRegistration | undefined;
    if ("serviceWorker" in navigator) {
      try {
        swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      } catch (e) {
        console.warn("Could not register firebase-messaging-sw.js, trying /sw.js", e);
        swRegistration = await navigator.serviceWorker.register("/sw.js");
      }
    }

    // Initialize Firebase Messaging if supported
    const messagingSupported = await isSupported().catch(() => false);
    let token = "";

    if (messagingSupported) {
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const messaging = getMessaging(app);

      token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swRegistration
      });

      if (token) {
        // Save token in Firestore for Admin Broadcasts
        const tokenRef = doc(db, "push_tokens", token);
        await setDoc(tokenRef, {
          token,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          userAgent: navigator.userAgent,
          platform: navigator.platform || "Web",
          active: true
        }, { merge: true });
      }
    }

    // Show initial welcome notification
    if (swRegistration && swRegistration.showNotification) {
      swRegistration.showNotification("ShafinBD Jobs নোটিফিকেশন চালু হয়েছে! 🎉", {
        body: "নতুন সরকারি ও বেসরকারি চাকরির খবর এখন সরাসরি আপনার মোবাইল ফোনে পাবেন।",
        icon: NOTIFICATION_ICON,
        badge: NOTIFICATION_ICON,
        tag: "welcome-notification",
        data: { url: "/" }
      });
    } else {
      new Notification("ShafinBD Jobs নোটিফিকেশন চালু হয়েছে! 🎉", {
        body: "নতুন সরকারি ও বেসরকারি চাকরির খবর এখন সরাসরি আপনার মোবাইল ফোনে পাবেন।",
        icon: NOTIFICATION_ICON,
      });
    }

    // Save granted state in localStorage
    localStorage.setItem("shafinbd_notification_granted", "true");

    return { success: true, token };
  } catch (err: any) {
    console.error("Error enabling push notifications:", err);
    return { success: false, reason: err?.message || "অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে" };
  }
};

/**
 * Trigger local broadcast and send push notification record to Firestore
 */
export const triggerPushBroadcast = async (payload: { title: string; body: string; url?: string; jobCategory?: string }) => {
  const icon = NOTIFICATION_ICON;
  const url = payload.url || "/";

  // 1. Show local notification on active device if permission granted
  if (getNotificationPermission() === "granted") {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(`📢 ${payload.title}`, {
          body: payload.body,
          icon,
          badge: icon,
          vibrate: [200, 100, 200],
          data: { url },
          tag: `job-notice-${Date.now()}`
        });
      }).catch(() => {
        new Notification(`📢 ${payload.title}`, { body: payload.body, icon });
      });
    } else if ("Notification" in window) {
      new Notification(`📢 ${payload.title}`, { body: payload.body, icon });
    }
  }

  // 2. Save broadcast payload to Firestore `push_broadcasts` collection
  try {
    const broadcastRef = doc(collection(db, "push_broadcasts"));
    await setDoc(broadcastRef, {
      title: payload.title,
      body: payload.body,
      url,
      jobCategory: payload.jobCategory || "General",
      createdAt: serverTimestamp(),
      icon
    });
  } catch (err) {
    console.warn("Could not record broadcast to Firestore:", err);
  }
};
