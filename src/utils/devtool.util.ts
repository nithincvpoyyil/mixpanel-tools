export function devToolsNetworkListener(
  callback: (request: chrome.devtools.network.Request) => void
): void {
  if (
    typeof chrome !== 'undefined' &&
    chrome.devtools?.network?.onRequestFinished
  ) {
    chrome.devtools.network.onRequestFinished.addListener(callback);
  } else {
    throw new Error('Chrome DevTools network API is not available');
  }
}
