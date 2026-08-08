/**
 * ShafinBD Extension Popup Controller
 * Operates cross-browser via browserAPI polyfill
 */

document.addEventListener('DOMContentLoaded', () => {
  const getAPI = () => (typeof browserAPI !== 'undefined' ? browserAPI : (typeof chrome !== 'undefined' ? chrome : null));
  const api = getAPI();

  const connectionBadge = document.getElementById('connection-badge');
  const profileCard = document.getElementById('profile-card');
  const loggedOutCard = document.getElementById('logged-out-card');

  const userAvatar = document.getElementById('user-avatar');
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  const userPhone = document.getElementById('user-phone');
  const nidStatus = document.getElementById('nid-status');
  const lastSync = document.getElementById('last-sync');

  const btnAutofill = document.getElementById('btn-autofill');
  const btnOpenPortal = document.getElementById('btn-open-portal');

  const toggleSettingsBtn = document.getElementById('toggle-settings');
  const settingsBody = document.getElementById('settings-body');
  const delayCascadingInput = document.getElementById('delay-cascading');
  const valCascadingText = document.getElementById('val-cascading');
  const delayConditionalInput = document.getElementById('delay-conditional');
  const valConditionalText = document.getElementById('val-conditional');
  const btnSaveSettings = document.getElementById('btn-save-settings');

  // Load extension state from Service Worker
  if (api && api.runtime && api.runtime.sendMessage) {
    api.runtime.sendMessage({ type: 'GET_EXTENSION_STATE' }, (response) => {
      if (!response) return;

      const { userProfile, lastSyncedAt, autofillSettings } = response;

      if (userProfile && userProfile.fullName) {
        // User is logged in
        connectionBadge.textContent = '● কানেক্টেড';
        connectionBadge.className = 'badge connected';

        profileCard.classList.remove('hidden');
        loggedOutCard.classList.add('hidden');

        userAvatar.textContent = (userProfile.fullName || 'U').charAt(0).toUpperCase();
        userName.textContent = userProfile.fullName;
        userEmail.textContent = userProfile.email || 'Email missing';
        userPhone.textContent = userProfile.phone || userProfile.mobile || 'Phone missing';

        nidStatus.textContent = userProfile.nidNumber ? 'যুক্ত আছে' : 'সংযুক্ত নেই';
        lastSync.textContent = lastSyncedAt ? new Date(lastSyncedAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) : 'এখনই';
      } else {
        // User logged out
        connectionBadge.textContent = '● বিচ্ছিন্ন';
        connectionBadge.className = 'badge disconnected';

        profileCard.classList.add('hidden');
        loggedOutCard.classList.remove('hidden');
      }

      // Settings Setup
      if (autofillSettings) {
        delayCascadingInput.value = autofillSettings.cascadingDelayMs || 600;
        valCascadingText.textContent = autofillSettings.cascadingDelayMs || 600;

        delayConditionalInput.value = autofillSettings.conditionalDelayMs || 250;
        valConditionalText.textContent = autofillSettings.conditionalDelayMs || 250;
      }
    });
  }

  // Settings Sliders Input updates
  delayCascadingInput.addEventListener('input', (e) => {
    valCascadingText.textContent = e.target.value;
  });

  delayConditionalInput.addEventListener('input', (e) => {
    valConditionalText.textContent = e.target.value;
  });

  // Toggle Settings Body
  toggleSettingsBtn.addEventListener('click', () => {
    settingsBody.classList.toggle('hidden');
  });

  // Save Settings Event
  btnSaveSettings.addEventListener('click', () => {
    const newSettings = {
      cascadingDelayMs: parseInt(delayCascadingInput.value, 10),
      conditionalDelayMs: parseInt(delayConditionalInput.value, 10)
    };

    if (api && api.runtime && api.runtime.sendMessage) {
      api.runtime.sendMessage({ type: 'SAVE_EXTENSION_SETTINGS', settings: newSettings }, () => {
        btnSaveSettings.textContent = '✅ সেভ হয়েছে';
        setTimeout(() => {
          btnSaveSettings.textContent = '💾 সেটিংস সেভ করুন';
        }, 2000);
      });
    }
  });

  // Trigger AutoFill on Current Tab
  btnAutofill.addEventListener('click', () => {
    btnAutofill.textContent = '⏳ প্রসেসিং হচ্ছে...';
    btnAutofill.disabled = true;

    if (api && api.tabs && api.tabs.query) {
      api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          api.tabs.sendMessage(tabs[0].id, { type: 'TRIGGER_AUTOFILL' }, (res) => {
            btnAutofill.textContent = '✅ অটো-ফিল সম্পন্ন!';
            setTimeout(() => {
              btnAutofill.textContent = '⚡ Teletalk ফরম অটো-ফিল করুন';
              btnAutofill.disabled = false;
            }, 2500);
          });
        }
      });
    }
  });

  // Open Web App Portal Button
  btnOpenPortal.addEventListener('click', () => {
    if (api && api.tabs && api.tabs.create) {
      api.tabs.create({ url: 'https://www.jobs.shafinbd.com' });
    } else {
      window.open('https://www.jobs.shafinbd.com', '_blank');
    }
  });
});
