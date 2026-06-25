// MV3 service worker background script

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    console.info('Mixpanel Tools - Message:', message);
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === 'SET_BADGE') {
    const count = message.count ?? 0;
    const text = count > 0 ? (count > 999 ? '999+' : String(count)) : '';
    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ color: '#2563eb' });
    chrome.storage.local.set({ EVENT_COUNT: count });
  }
});
