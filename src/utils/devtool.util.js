var i = 0;
const appendData = (data) => {
    var dateSpan = document.createElement('div');
    dateSpan.innerHTML = data;
    document.querySelector('#mixpanel-tool').appendChild(dateSpan);
};

class DevToolNetworkListner {
    constructor(networkCallback) {
        this.handleNetwork = this.handleNetwork.bind(this);
        this.init(this.handleNetwork);
        this.networkCallback = networkCallback;
    }

    init(callback) {
        let chromeAPI = chrome;
        if (chromeAPI &&chromeAPI.devtools &&chromeAPI.devtools.network &&chromeAPI.devtools.network.onRequestFinished) {
           chromeAPI.devtools.network.onRequestFinished.addListener(callback);
        } else {
            throw new Error('Chrome is not defined');
        }
    }

    handleNetwork(request) {
        console.log('\n Url', request.request.url);
        if(this.networkCallback){
            this.networkCallback(request);
        }
    }
}

