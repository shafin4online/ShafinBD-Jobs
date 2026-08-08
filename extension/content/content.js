/**
 * ShafinBD Teletalk Content Script
 * Injects floating auto-fill widget and handles cross-browser messages
 */

(function () {
  console.log('[ShafinBD ContentScript] Active on Teletalk portal:', window.location.hostname);

  const getAPI = () => (typeof browserAPI !== 'undefined' ? browserAPI : (typeof chrome !== 'undefined' ? chrome : null));

  let currentProfile = null;
  let currentSettings = { cascadingDelayMs: 600, conditionalDelayMs: 250 };
  let isFilling = false;
  let fillTimeoutId = null;

  // Listen for window postMessage events from Web App bridge
  window.addEventListener('message', (event) => {
    if (event.data && event.data.source === 'SHAFINBD_WEB_BRIDGE_RELAY' && event.data.type === 'SHAFINBD_SYNC_PROFILE') {
      const api = getAPI();
      if (api && api.runtime && api.runtime.sendMessage) {
        api.runtime.sendMessage({ type: 'SHAFINBD_SYNC_PROFILE', payload: event.data.payload }, (res) => {
          if (res && res.status === 'SUCCESS') {
            console.log('[ShafinBD ContentScript] Profile synced from Web Bridge relay.');
            refreshState();
          }
        });
      }
    }
  });

  // Fetch extension state from background service worker
  function refreshState(callback) {
    const api = getAPI();
    if (api && api.runtime && api.runtime.sendMessage) {
      api.runtime.sendMessage({ type: 'GET_EXTENSION_STATE' }, (res) => {
        if (res && res.status === 'SUCCESS') {
          currentProfile = res.userProfile;
          currentSettings = res.autofillSettings || currentSettings;
          updateWidgetUI();
          if (callback) callback();
        }
      });
    }
  }

  // Update floating widget UI state
  function updateWidgetUI() {
    const nameEl = document.querySelector('#shafinbd-autofill-widget .sbd-user-name');
    const statusEl = document.getElementById('sbd-user-status-text');
    const btnEl = document.getElementById('sbd-trigger-fill');

    const hasUser = !!(currentProfile && currentProfile.fullName);
    const phoneNumber = currentProfile ? (currentProfile.phone || currentProfile.mobile || currentProfile.mobileNumber || '') : '';

    if (nameEl) nameEl.textContent = hasUser ? currentProfile.fullName : 'লগইন করা নেই';
    if (statusEl) statusEl.textContent = hasUser ? (phoneNumber ? `📱 ${phoneNumber}` : 'প্রোফাইল প্রস্তুত') : 'ShafinBD এ লগইন করুন';
    if (btnEl) btnEl.textContent = hasUser ? '⚡ অটো-ফিল ফরম' : '🌐 পোর্টালে লগইন করুন';
  }

  // Inject Floating Widget onto Teletalk Application Form Pages
  function injectFloatingWidget() {
    if (document.getElementById('shafinbd-autofill-widget')) return;

    const hasFormElements = document.querySelector('form') || document.querySelector('input') || document.querySelector('select');
    if (!hasFormElements) return;

    const widget = document.createElement('div');
    widget.id = 'shafinbd-autofill-widget';

    const hasUser = !!(currentProfile && currentProfile.fullName);
    const phoneNumber = currentProfile ? (currentProfile.phone || currentProfile.mobile || currentProfile.mobileNumber || '') : '';

    const userInfo = document.createElement('div');
    userInfo.className = 'sbd-user-info';

    const userName = document.createElement('span');
    userName.className = 'sbd-user-name';
    userName.textContent = hasUser ? currentProfile.fullName : 'লগইন করা নেই';

    const userStatus = document.createElement('span');
    userStatus.className = 'sbd-user-status';
    userStatus.id = 'sbd-user-status-text';
    userStatus.textContent = hasUser ? (phoneNumber ? `📱 ${phoneNumber}` : 'প্রোফাইল প্রস্তুত') : 'ShafinBD এ লগইন করুন';

    userInfo.appendChild(userName);
    userInfo.appendChild(userStatus);

    const fillBtn = document.createElement('button');
    fillBtn.id = 'sbd-trigger-fill';
    fillBtn.className = 'sbd-fill-btn';
    fillBtn.textContent = hasUser ? '⚡ অটো-ফিল ফরম' : '🌐 পোর্টালে লগইন করুন';

    widget.appendChild(userInfo);
    widget.appendChild(fillBtn);

    document.body.appendChild(widget);

    fillBtn.addEventListener('click', () => {
      if (!currentProfile) {
        userStatus.textContent = '⚠️ আগে পোর্টালে লগইন করুন!';
        userStatus.style.color = '#f87171';
        const api = getAPI();
        if (api && api.runtime && api.runtime.sendMessage) {
          api.runtime.sendMessage({ type: 'OPEN_LOGIN' });
        } else {
          window.open('https://www.jobs.shafinbd.com', '_blank');
        }
        return;
      }
      executeAutoFill();
    });
  }

  // Execute AutoFill with Visual Feedback, Lock, and Timeout
  async function executeAutoFill() {
    if (isFilling) {
      console.warn('[ShafinBD AutoFill] Fill operation is already in progress.');
      return;
    }

    isFilling = true;
    const btn = document.getElementById('sbd-trigger-fill');
    const statusText = document.getElementById('sbd-user-status-text');

    if (btn) {
      btn.textContent = '⏳ প্রসেসিং হচ্ছে...';
      btn.disabled = true;
    }

    fillTimeoutId = setTimeout(() => {
      if (isFilling) {
        isFilling = false;
        if (btn) {
          btn.textContent = '⚡ অটো-ফিল ফরম';
          btn.disabled = false;
        }
        if (statusText) {
          statusText.textContent = '⏱️ সময় শেষ! আবার চেষ্টা করুন';
          statusText.style.color = '#fbbf24';
        }
      }
    }, 15000);

    refreshState(async () => {
      if (!currentProfile) {
        isFilling = false;
        clearTimeout(fillTimeoutId);
        if (btn) {
          btn.textContent = '🌐 পোর্টালে লগইন করুন';
          btn.disabled = false;
        }
        if (statusText) {
          statusText.textContent = '⚠️ আগে পোর্টালে লগইন করুন!';
          statusText.style.color = '#f87171';
        }
        return;
      }

      try {
        const result = await window.ShafinBDAutoFillEngine.fillForm(currentProfile, currentSettings);

        if (btn) {
          btn.textContent = `✅ ${result.filledCount || ''} টি ফিল্ড পূরিত!`;
        }
        if (statusText) {
          if (result.report && result.report.validationWarnings && result.report.validationWarnings.length > 0) {
            statusText.textContent = `⚠️ পূরিত, তবে ${result.report.validationWarnings.length} টি সর্তকতা রয়েছে`;
            statusText.style.color = '#fbbf24';
          } else {
            statusText.textContent = 'সফলভাবে পূরণ হয়েছে!';
            statusText.style.color = '#34d399';
          }
        }
      } catch (err) {
        console.error('[ShafinBD AutoFill] Error during form fill:', err);
        if (btn) btn.textContent = '❌ ত্রুটি হয়েছে';
      } finally {
        clearTimeout(fillTimeoutId);
        setTimeout(() => {
          isFilling = false;
          if (btn) {
            btn.textContent = '⚡ অটো-ফিল ফরম';
            btn.disabled = false;
          }
          if (statusText && currentProfile) {
            const phone = currentProfile.phone || currentProfile.mobile || '';
            statusText.textContent = phone ? `📱 ${phone}` : 'প্রোফাইল প্রস্তুত';
            statusText.style.color = '#94a3b8';
          }
        }, 3500);
      }
    });
  }

  // Listen to incoming runtime messages
  const api = getAPI();
  if (api && api.runtime && api.runtime.onMessage) {
    api.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'TRIGGER_AUTOFILL') {
        executeAutoFill().then(() => {
          sendResponse({ status: 'COMPLETED' });
        });
        return true;
      }
    });
  }

  // Initial State Sync and Widget Injection
  refreshState(() => {
    injectFloatingWidget();
  });

  // MutationObserver to re-detect dynamic AJAX form loads
  const observer = new MutationObserver(() => {
    if (!document.getElementById('shafinbd-autofill-widget')) {
      injectFloatingWidget();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
