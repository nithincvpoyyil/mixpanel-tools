
// Create a tab in the devtools area
chrome.devtools.panels.create("Mixpanel Tools", "logo.png", "panel.html", function (panel) { 
    console.log(panel);
});
