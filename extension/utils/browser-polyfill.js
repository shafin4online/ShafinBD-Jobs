/**
 * ShafinBD Universal Extension API Polyfill
 * Cross-browser wrapper providing unified API across Chrome, Firefox, Brave, Edge, Opera
 */
(function () {
  const api = typeof browser !== 'undefined' ? browser : (typeof chrome !== 'undefined' ? chrome : null);
  
  if (typeof window !== 'undefined') {
    window.browserAPI = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.browserAPI = api;
  }
})();
