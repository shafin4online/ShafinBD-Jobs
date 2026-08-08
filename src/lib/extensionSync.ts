import { UserProfile } from '../types';
import { User } from 'firebase/auth';

declare const chrome: any;

/**
 * Syncs User Profile & Firebase ID Token to ShafinBD Teletalk Extension
 */
export async function syncProfileToExtension(profile: UserProfile, authUser: User | null) {
  if (typeof window === 'undefined') return;

  try {
    let idToken = '';
    if (authUser) {
      try {
        idToken = await authUser.getIdToken();
      } catch (e) {
        console.warn('[ExtensionSync] Could not fetch Firebase ID token:', e);
      }
    }

    const payload = {
      profile,
      idToken,
      uid: authUser?.uid || profile.id || '',
      profileVersion: 1,
      syncedAt: new Date().toISOString(),
      source: window.location.origin
    };

    // 1. Dispatch DOM window postMessage for web-bridge.js content script
    window.postMessage(
      {
        type: 'SHAFINBD_SYNC_PROFILE',
        payload
      },
      '*'
    );

    // 2. Backup in LocalStorage
    try {
      localStorage.setItem('shafinbd_profile_v2', JSON.stringify(profile));
    } catch (e) {
      console.warn('[ExtensionSync] LocalStorage save failed:', e);
    }

    // 3. Direct Extension Message if runtime available
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(
        {
          type: 'SHAFINBD_SYNC_PROFILE',
          payload
        },
        () => {
          if (chrome.runtime.lastError) {
            // Silence unhandled extension disconnects
          }
        }
      );
    }
  } catch (err) {
    console.warn('[ExtensionSync] Global sync failed:', err);
  }
}
