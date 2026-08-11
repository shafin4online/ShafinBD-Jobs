import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, serverTimestamp, getDocs, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { firebaseConfig, db } from "./firebase";

export const VAPID_KEY = "BFWUlHzbzaC56w2UtAsxoxa_gI97nexu0bNfskqkAJj6-Fti898Ge8r4SpSmA3gFOKeVGXrj18PHkbofFnKHd-4";
export const NOTIFICATION_ICON = "https://res.cloudinary.com/prmoymao/image/upload/v1786423884/pwa-192x192.webp";

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

  // 1. Send push notification via backend API (Firebase Admin FCM multicast to all user tokens)
  try {
    await fetch("/api/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: payload.title,
        body: payload.body,
        url,
        icon,
        jobCategory: payload.jobCategory || "General"
      })
    });
  } catch (err) {
    console.warn("Could not call /api/send-notification endpoint:", err);
  }

  // 2. Show immediate local notification if browser is actively open
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
        } as any);
      }).catch(() => {
        new Notification(`📢 ${payload.title}`, { body: payload.body, icon });
      });
    } else if ("Notification" in window) {
      new Notification(`📢 ${payload.title}`, { body: payload.body, icon });
    }
  }
};

/**
 * Setup Realtime Listener for Push Broadcasts in Firestore.
 * Whenever Admin publishes a job or sends a notification,
 * Firestore sends real-time snapshot to all active/installed PWA user devices!
 */
export const setupPushBroadcastListener = () => {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  try {
    const broadcastsRef = collection(db, "push_broadcasts");
    const q = query(broadcastsRef, orderBy("createdAt", "desc"), limit(3));

    const listenerStartTime = Date.now();
    let seenBroadcasts: Set<string>;
    try {
      seenBroadcasts = new Set<string>(
        JSON.parse(localStorage.getItem("shafinbd_seen_broadcasts") || "[]")
      );
    } catch {
      seenBroadcasts = new Set<string>();
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change: any) => {
        if (change.type === "added") {
          const id = change.doc.id;
          const data = change.doc.data();

          if (seenBroadcasts.has(id)) return;

          const createdAtMs = data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now();

          seenBroadcasts.add(id);
          try {
            const arr = Array.from(seenBroadcasts).slice(-50);
            localStorage.setItem("shafinbd_seen_broadcasts", JSON.stringify(arr));
          } catch {}

          // Ignore historical broadcasts from before the current app launch
          if (createdAtMs < listenerStartTime - 180000) return;

          // Show system notification
          if (getNotificationPermission() === "granted") {
            const title = data.title ? `📢 ${data.title}` : "ShafinBD Jobs - নতুন চাকরির বিজ্ঞপ্তি";
            const body = data.body || "নতুন নিয়োগ বিজ্ঞপ্তি প্রকাশিত হয়েছে!";
            const icon = data.icon || NOTIFICATION_ICON;
            const url = data.url || "/";

            if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
              navigator.serviceWorker.ready.then((reg) => {
                reg.showNotification(title, {
                  body,
                  icon,
                  badge: icon,
                  vibrate: [200, 100, 200],
                  data: { url },
                  tag: `broadcast-${id}`
                } as any);
              }).catch(() => {
                new Notification(title, { body, icon });
              });
            } else if ("Notification" in window) {
              new Notification(title, { body, icon });
            }
          }
        }
      });
    }, (error: any) => {
      console.warn("Firestore push broadcast listener warning:", error);
    });

    return unsubscribe;
  } catch (err) {
    console.warn("Could not setup push broadcast listener:", err);
  }
};
