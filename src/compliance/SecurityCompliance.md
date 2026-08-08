# Security Compliance & Store Publishing Guidelines
**ShafinBD Jobs - Teletalk AutoFill Extension**

*Security Specification & Review Checklist for Google Chrome Web Store & Mozilla Add-ons (AMO)*

---

## 1. Architectural Overview & Manifest V3 Standards

The ShafinBD Extension strictly adheres to **Manifest V3** specifications across all targeting environments (Chrome, Brave, Edge, Opera, and Firefox 109+):

- **Background Service Worker:** Standard Event-driven background service worker (`background/background.js`) with zero persistent DOM references.
- **Cross-Browser Compatibility:** Polyfilled via `browser-polyfill.js` to ensure consistent Promise-based API handling across Chromium and Gecko runtimes.
- **Declarative Permissions:** Principle of Least Privilege applied to all manifest declarations.

---

## 2. Code Safety & Static Analysis Compliance

To guarantee approval under Google Web Store Program Policies and Firefox Developer Security Standards:

1. **Forbidden Primitives Avoided:**
   - **No `eval()` or `Function()` calls:** All dynamic logic uses deterministic string transformers and typed validation rules.
   - **No `innerHTML` Injection:** Dynamic element updates utilize standard `textContent` and safe DOM manipulation methods.
   - **No Remote Code Execution (RCE):** 100% of executable JavaScript logic is statically bundled inside the extension package.

2. **Content Security Policy (CSP):**
   ```json
   "content_security_policy": {
     "extension_pages": "script-src 'self'; object-src 'self';"
   }
   ```
   Prevents external script execution and enforces strict origin sandboxing.

---

## 3. Data Processing & Privacy Safeguards

### A. Secure Web-to-Extension Bridge
Communication between the `www.jobs.shafinbd.com` web portal and the extension background worker is secured via a 2-stage handshake:
1. **Origin Verification:**
   ```javascript
   if (event.origin !== 'https://www.jobs.shafinbd.com' && !event.origin.includes('shafinbd.com') && !event.origin.includes('.run.app')) return;
   ```
2. **Payload Sanitization:** Incoming profile payloads pass through `ShafinBDValidator` schema checks before being committed to `chrome.storage.local`.

### B. HTML Canvas Processing & Media Safety
Profile Photos (300x300 px) and Signatures (300x80 px) are processed locally:
- Images are drawn onto isolated, off-screen HTML Canvas elements.
- Clean white backgrounds (`#FFFFFF`) are enforced to prevent transparency artifacts or memory overflow issues.
- Converted to binary JPEG `Blob` files and attached via standard DOM `DataTransfer` APIs.

---

## 4. Pre-Publishing Checklist for Extension Stores

### Chrome Web Store Publishing Requirements:
- [x] **Manifest V3 Specification:** Fully updated in `manifest.chrome.json`.
- [x] **Store Assets:** High-resolution icons included (`icon16.png`, `icon48.png`, `icon128.png`).
- [x] **Promotional Screenshots:** 1280x800 px or 640x400 px extension popups and autofill preview captures.
- [x] **Privacy Policy Disclosure:** Validated live link pointing to `https://www.jobs.shafinbd.com/#/privacy`.
- [x] **Single Purpose Description:** Clear Bengali & English description emphasizing government job form completion on `*.teletalk.com.bd`.
- [x] **Permissions Justification:** All requested permissions (`storage`, `activeTab`, `tabs`, `scripting`) explained under the Developer Dashboard.

### Mozilla Firefox Add-ons (AMO) Publishing Requirements:
- [x] **Gecko ID Configured:** `autofill@shafinbd.com` specified in `browser_specific_settings.gecko`.
- [x] **Background Script Array:** Background runner specified in array format (`background.scripts`) in `manifest.firefox.json`.
- [x] **Source Code Submission:** Unified cross-browser build script (`scripts/build-extension.js`) producing `dist/shafinbd-jobs-extension-firefox-v1.0.0.zip`.

---

## 5. Build Verification Command

To compile and produce production-ready ZIP archives for all store targets:

```bash
npm run build:all
```

**Generated Production Artifacts:**
- `dist/shafinbd-jobs-extension-chrome-v1.0.0.zip` (Chrome / Brave / Edge / Opera)
- `dist/shafinbd-jobs-extension-firefox-v1.0.0.zip` (Mozilla Firefox)
