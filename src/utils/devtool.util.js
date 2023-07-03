function devToolsNetworkListner(callbackFn) {
  let chromeAPI = chrome;
  if (typeof callbackFn === "function") {
    if (
      chromeAPI &&
      chromeAPI.devtools &&
      chromeAPI.devtools.network &&
      chromeAPI.devtools.network.onRequestFinished
    ) {
      chromeAPI.devtools.network.onRequestFinished.addListener(callbackFn);
    } else {
      throw new Error("Chrome API is not defined");
    }
  }
}

