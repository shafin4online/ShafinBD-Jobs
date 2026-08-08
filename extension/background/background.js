/**
 * Background Service Worker for ShafinBD Jobs Extension
 * Cross-browser state management, auth sync, and settings processor
 */

const getAPI = () => (typeof browserAPI !== 'undefined' ? browserAPI : (typeof chrome !== 'undefined' ? chrome : null));

const DEFAULT_SETTINGS = {
  cascadingDelayMs: 600,
  conditionalDelayMs: 250,
  autoHighlightFields: true
};

// Initialize default settings on install
const api = getAPI();
if (api && api.runtime && api.runtime.onInstalled) {
  api.runtime.onInstalled.addListener(() => {
    if (api.storage && api.storage.local) {
      api.storage.local.get(['autofillSettings'], (result) => {
        if (!result || !result.autofillSettings) {
          api.storage.local.set({ autofillSettings: DEFAULT_SETTINGS });
        }
      });
    }
    console.log('[ShafinBD ServiceWorker] Extension installed successfully.');
  });
}

// Helper for safe storage save with error handling
function saveStorageData(data, sendResponse) {
  const runtimeApi = getAPI();
  if (!runtimeApi || !runtimeApi.storage || !runtimeApi.storage.local) {
    sendResponse({ status: 'ERROR', message: 'Storage API unavailable' });
    return;
  }

  runtimeApi.storage.local.set(data, () => {
    if (runtimeApi.runtime && runtimeApi.runtime.lastError) {
      sendResponse({
        status: 'ERROR',
        message: runtimeApi.runtime.lastError.message
      });
    } else {
      sendResponse({ status: 'SUCCESS', ...data });
    }
  });
}

// Unified Message Processor
function handleIncomingMessage(message, sender, sendResponse) {
  if (!message) return false;
  const type = message.type || message.action;

  switch (type) {
    case 'PING':
      sendResponse({ status: 'PONG', version: '1.0.0', time: new Date().toISOString() });
      return true;

    case 'SYNC_PROFILE':
    case 'SHAFINBD_SYNC_PROFILE': {
      const { profile, idToken, uid, profileVersion } = message.payload || message;
      if (profile) {
        saveStorageData(
          {
            userProfile: profile,
            idToken: idToken || '',
            uid: uid || profile.id || '',
            profileVersion: profileVersion || 1,
            lastSyncedAt: new Date().toISOString()
          },
          sendResponse
        );
        return true;
      }
      sendResponse({ status: 'ERROR', message: 'Invalid profile payload' });
      return true;
    }

    case 'GET_PROFILE':
    case 'GET_EXTENSION_STATE': {
      const runtimeApi = getAPI();
      if (!runtimeApi || !runtimeApi.storage || !runtimeApi.storage.local) {
        sendResponse({ status: 'ERROR', message: 'Storage API unavailable' });
        return true;
      }

      runtimeApi.storage.local.get(
        ['userProfile', 'idToken', 'uid', 'profileVersion', 'lastSyncedAt', 'autofillSettings'],
        (data) => {
          if (runtimeApi.runtime && runtimeApi.runtime.lastError) {
            sendResponse({ status: 'ERROR', message: runtimeApi.runtime.lastError.message });
          } else {
            sendResponse({
              status: 'SUCCESS',
              userProfile: data?.userProfile || null,
              idToken: data?.idToken || '',
              uid: data?.uid || '',
              profileVersion: data?.profileVersion || 1,
              lastSyncedAt: data?.lastSyncedAt || null,
              autofillSettings: data?.autofillSettings || DEFAULT_SETTINGS
            });
          }
        }
      );
      return true;
    }

    case 'UPDATE_PROFILE': {
      const updatedProfile = message.profile || message.payload?.profile;
      if (updatedProfile) {
        const runtimeApi = getAPI();
        if (runtimeApi && runtimeApi.storage && runtimeApi.storage.local) {
          runtimeApi.storage.local.get(['userProfile'], (existing) => {
            const merged = { ...(existing?.userProfile || {}), ...updatedProfile };
            saveStorageData({ userProfile: merged, lastSyncedAt: new Date().toISOString() }, sendResponse);
          });
          return true;
        }
      }
      sendResponse({ status: 'ERROR', message: 'No profile data to update' });
      return true;
    }

    case 'GET_SETTINGS': {
      const runtimeApi = getAPI();
      if (runtimeApi && runtimeApi.storage && runtimeApi.storage.local) {
        runtimeApi.storage.local.get(['autofillSettings'], (data) => {
          sendResponse({
            status: 'SUCCESS',
            settings: data?.autofillSettings || DEFAULT_SETTINGS
          });
        });
        return true;
      }
      sendResponse({ status: 'SUCCESS', settings: DEFAULT_SETTINGS });
      return true;
    }

    case 'SAVE_SETTINGS':
    case 'SAVE_EXTENSION_SETTINGS': {
      const settings = message.settings || message.payload?.settings;
      if (settings) {
        saveStorageData({ autofillSettings: settings }, sendResponse);
        return true;
      }
      sendResponse({ status: 'ERROR', message: 'No settings provided' });
      return true;
    }

    case 'CLEAR_PROFILE':
    case 'CLEAR_EXTENSION_PROFILE': {
      const runtimeApi = getAPI();
      if (runtimeApi && runtimeApi.storage && runtimeApi.storage.local) {
        runtimeApi.storage.local.remove(['userProfile', 'idToken', 'uid', 'lastSyncedAt'], () => {
          if (runtimeApi.runtime && runtimeApi.runtime.lastError) {
            sendResponse({ status: 'ERROR', message: runtimeApi.runtime.lastError.message });
          } else {
            sendResponse({ status: 'PROFILE_CLEARED' });
          }
        });
        return true;
      }
      sendResponse({ status: 'ERROR', message: 'Storage API unavailable' });
      return true;
    }

    case 'CHECK_AUTH': {
      const runtimeApi = getAPI();
      if (runtimeApi && runtimeApi.storage && runtimeApi.storage.local) {
        runtimeApi.storage.local.get(['userProfile', 'idToken'], (data) => {
          sendResponse({
            isAuthenticated: !!(data?.userProfile && data.userProfile.fullName),
            hasToken: !!data?.idToken,
            email: data?.userProfile?.email || null
          });
        });
        return true;
      }
      sendResponse({ isAuthenticated: false, hasToken: false, email: null });
      return true;
    }

    case 'OPEN_LOGIN': {
      const runtimeApi = getAPI();
      if (runtimeApi && runtimeApi.tabs) {
        runtimeApi.tabs.create({ url: 'https://www.jobs.shafinbd.com' });
        sendResponse({ status: 'OPENED' });
        return true;
      }
      sendResponse({ status: 'ERROR', message: 'Tabs API unavailable' });
      return true;
    }

    default:
      sendResponse({ status: 'UNKNOWN_TYPE', type });
      return true;
  }
}

// 1. Internal Runtime Messages (Content Scripts, Popup)
if (api && api.runtime && api.runtime.onMessage) {
  api.runtime.onMessage.addListener(handleIncomingMessage);
}

// 2. External Runtime Messages (Directly from Web Page when using externally_connectable)
if (api && api.runtime && api.runtime.onMessageExternal) {
  api.runtime.onMessageExternal.addListener(handleIncomingMessage);
}
