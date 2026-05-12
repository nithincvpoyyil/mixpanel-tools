// MV3 service worker background script
// Uses chrome.runtime APIs (replaces deprecated chrome.extension APIs)

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    console.info("Mixpanel Tools - Message:", message);
  });
});
