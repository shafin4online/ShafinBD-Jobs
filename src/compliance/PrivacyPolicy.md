# Privacy Policy & Store Listing Disclosure
**ShafinBD Jobs - Teletalk AutoFill Extension & Web Portal**

*Last Updated: August 2026*  
*Official Privacy Policy URL: https://www.jobs.shafinbd.com/#/privacy*

---

## 1. Executive Summary & Single Purpose Declaration
**ShafinBD Jobs - Teletalk AutoFill Extension** is designed with a strict **Single Purpose**: to enable job applicants in Bangladesh to securely sync their verified profile data from the ShafinBD Jobs portal (`www.jobs.shafinbd.com`) and autofill government job application forms on Teletalk Bangladesh portals (`*.teletalk.com.bd`) in 1-click.

This policy applies to both the **ShafinBD Jobs Web Application** and the **ShafinBD Jobs Browser Extension** (Chrome Web Store, Brave, Edge, Opera, and Mozilla Firefox Add-ons).

---

## 2. Information Collected and Processed

### A. Web Application Data (User Profile)
When users create and manage their job profile on `www.jobs.shafinbd.com`, the following user-authored data is stored securely in Google Firebase Firestore:
1. **Personal Identity Data:** Full Name, Father's Name, Mother's Name, Date of Birth, Gender, Marital Status, Religion, National ID (NID) / Birth Registration Number, Mobile Number, Email Address.
2. **Address Data:** Present Address & Permanent Address (Division, District, Upazila, Post Code, Care Of).
3. **Academic Qualifications:** SSC, HSC, and Graduation/Masters credentials (Exam Board, Roll Number, Registration Number, GPA/Class, Passing Year, Subject Group).
4. **Media Credentials:** Profile Photo (300x300 px) and Signature (300x80 px), processed locally via HTML Canvas Engine.

### B. Extension Local Storage & Data Handling
- **Local Storage Isolation:** The extension stores synced profile data strictly inside the browser's encrypted local storage (`chrome.storage.local` for Chromium browsers, `browser.storage.local` for Firefox).
- **No Remote Telemetry:** The extension does **NOT** send filled form data, user input, or browsing activity to any external analytics server, ad network, or third-party database.
- **Client-Side Canvas Processing:** Profile images and signatures are validated and resized directly inside the browser using HTML Canvas before attaching to Teletalk upload inputs.

---

## 3. Chrome Web Store & Firefox Add-ons Permission Justifications

To comply with the **Chrome Web Store User Data Policy** and **Mozilla Firefox Developer Guidelines**, every requested permission in `manifest.json` is strictly justified by the extension's core functionality:

| Permission | Category | Purpose & Single-Use Justification |
| :--- | :--- | :--- |
| `storage` | Core Permission | To store the user's encrypted profile credentials locally on their device for fast 1-click autofill. |
| `activeTab` | Core Permission | To access the currently active tab when the user clicks "Fill Form" or opens the extension popup. |
| `tabs` | Navigation | To detect when a user is navigating a supported Teletalk job application page (`*.teletalk.com.bd`). |
| `scripting` | Execution | To inject standard, non-eval autofill scripts into Teletalk form fields upon user command. |
| `host_permissions` | Restricted Host | Limited exclusively to `*://*.teletalk.com.bd/*` (Teletalk form domain) and `https://www.jobs.shafinbd.com/*` (Portal domain). |

---

## 4. Security & Content Security Policy (CSP) Compliance

1. **Strict CSP Declaration:**  
   ```json
   "content_security_policy": {
     "extension_pages": "script-src 'self'; object-src 'self';"
   }
   ```
   - **No Remote Scripts:** No remote code (e.g., Google CDN scripts, eval(), innerHTML injection) is loaded or executed.
   - **Static Scripts:** All JavaScript files used in content scripts and background service workers are bundled locally within the extension package.

2. **Web Bridge Security:**
   - Communication between the web portal and extension uses standard `window.postMessage` with strict origin checking (`event.origin === 'https://www.jobs.shafinbd.com'`).

---

## 5. Third-Party Data Sharing & Commercial Disclosure
- **Zero Data Monetization:** We **DO NOT** sell, rent, trade, or transfer user profile data or browsing history to any third party.
- **Zero Ad Tracking:** We do **NOT** display advertisements or embed third-party tracking SDKs inside the extension or application.

---

## 6. User Rights, Data Erasure & Uninstallation
- **Data Erasure:** Users can update or delete their profile information at any time from the ShafinBD Jobs portal account settings.
- **Local Cache Removal:** Uninstalling the extension automatically purges all locally stored profile credentials from `chrome.storage.local`.

---

## 7. Developer Contact & Support
For compliance inquiries, privacy questions, or technical support:
- **Developer / Publisher:** ShafinBD Team
- **Official Contact Email:** `shafinbd4u@gmail.com`
- **Official Portal & Privacy Policy:** `https://www.jobs.shafinbd.com/#/privacy`
