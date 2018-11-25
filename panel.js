// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.extension.*


var i = 0;
const appendData = (data) => {
    var dateSpan = document.createElement('div');
    dateSpan.innerHTML = data;
    document.querySelector('#mixpanel-tool').appendChild(dateSpan);
};

// request chnage
chrome.devtools.network.onRequestFinished.addListener(function (request) {

    var params = request;
    params.requestId = i;
    i++;
    console.log('request', request);
    if (params.request.url.indexOf("api.mixpanel.com/track/?data=") > -1 || params.request.url.indexOf("api.mixpanel.com/engage/?data=") > -1) {

        requests = [];
        requests[params.requestId] = request;

        var queryString = params.request.url;
        queryString = queryString.split("?");
        // Split into key/value pairs
        var queries = queryString[1].split("&");
        // Convert the array of strings into an object
        for (i = 0, l = queries.length; i < l; i++) {
            temp = queries[i].split('=');
            params[temp[0]] = temp[1];
        }

        //Formatting Data Param
        var tests = params['data'];
        var re = new RegExp("%3D", 'g');
        tests = tests.replace(re, "");
        var tracking = atob(tests);
        console.log(JSON.parse(tracking));
        var data = JSON.parse(tracking);

        appendData(JSON.stringify(data, null, 2));

        if (typeof data.event === "undefined") {
            title = "People Update";
            peop = 1;
        } else {
            title = data.event;
            peop = 0;
        }
    }

});



