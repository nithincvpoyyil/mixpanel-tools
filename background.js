/* 
Chrome automatically creates a background.html page for this to execute.
This can access the inspected page via executeScript

Can use:
chrome.tabs.*
chrome.extension.* 
*/

chrome.extension.onConnect.addListener(function (port) {
  var extensionListener = (message, sender, sendResponse) => {
    console.info("Message:", message, sender, sendResponse);
  };

  // Listens to messages sent from the panel
  chrome.extension.onMessage.addListener(extensionListener);
});
