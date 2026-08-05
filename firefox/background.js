// MV2 background script for Firefox

browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    console.info('Mixpanel Tools - Message:', message);
  });
});

browser.runtime.onMessage.addListener((message) => {
  if (message?.type === 'SET_BADGE') {
    const count = message.count ?? 0;
    const text = count > 0 ? (count > 999 ? '999+' : String(count)) : '';
    browser.browserAction.setBadgeText({ text });
    browser.browserAction.setBadgeBackgroundColor({ color: '#2563eb' });
    browser.storage.local.set({ EVENT_COUNT: count });
  }
});
