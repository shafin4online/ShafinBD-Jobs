/**
 * ShafinBD Jobs Web Bridge
 * Relays authenticated user profile state from Web App portal to Browser Extension
 * Operates cross-browser via window.postMessage & Extension Runtime Messaging
 */
(function () {
  console.log('[ShafinBD Bridge] Web-Bridge active on Web Portal domain.');

  const getAPI = () => (typeof browserAPI !== 'undefined' ? browserAPI : (typeof chrome !== 'undefined' ? chrome : null));

  // Dispatch profile to extension background via Extension Runtime API
  function dispatchToExtension(payload) {
    if (!payload || !payload.profile) return;

    const api = getAPI();
    const msgData = {
      type: 'SHAFINBD_SYNC_PROFILE',
      payload: {
        profile: payload.profile,
        idToken: payload.idToken || '',
        uid: payload.uid || payload.profile.id || '',
        profileVersion: payload.profileVersion || 1,
        syncedAt: payload.syncedAt || new Date().toISOString(),
        source: payload.source || window.location.origin
      }
    };

    if (api && api.runtime && api.runtime.sendMessage) {
      try {
        api.runtime.sendMessage(msgData, (response) => {
          if (api.runtime.lastError) {
            console.log('[ShafinBD Bridge] Direct runtime sync note:', api.runtime.lastError.message);
          } else {
            console.log('[ShafinBD Bridge] Direct extension sync response:', response);
          }
        });
      } catch (e) {
        console.log('[ShafinBD Bridge] Extension context pending:', e.message);
      }
    }

    // Also broadcast window postMessage relay for ContentScript bridge capture
    window.postMessage({
      source: 'SHAFINBD_WEB_BRIDGE_RELAY',
      type: 'SHAFINBD_SYNC_PROFILE',
      payload: msgData.payload
    }, '*');
  }

  // Listen for window postMessage events from React Web App
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    if (event.data && event.data.type === 'SHAFINBD_SYNC_PROFILE' && event.data.source !== 'SHAFINBD_WEB_BRIDGE_RELAY') {
      dispatchToExtension(event.data.payload || event.data);
    }

    if (event.data && event.data.type === 'SHAFINBD_REQUEST_PROFILE_SYNC') {
      const raw = localStorage.getItem('shafinbd_profile_v2');
      if (raw) {
        try {
          const profile = JSON.parse(raw);
          dispatchToExtension({ profile, profileVersion: 1 });
        } catch (e) {}
      }
    }
  });

  // Check initial localStorage backup on load
  try {
    const rawProfile = localStorage.getItem('shafinbd_profile_v2');
    if (rawProfile) {
      const profile = JSON.parse(rawProfile);
      dispatchToExtension({ profile, profileVersion: 1 });
    }
  } catch (err) {}
})();
