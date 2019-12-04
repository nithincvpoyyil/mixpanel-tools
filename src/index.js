/**
 * MixpanelTool chrome extension
 * 
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @classname MixpanelTool
 */
class MixpanelTool {
    constructor() {
        this.state = {
            requests: {},
            selectedRequest: {},
            count: 0,
            omitMixpanelProperty: true,
            record: true
        };
        this.mixpanelAPIPattern = MIXPANEL_API_PATTERN;
        this.mixpanelProperties = MIXPANEL_PROPERTIES;
        this.bindEvents();
    }

    bindEvents() {
        $(() => {
            $(".record-btn").off("click").on("click", (event) => {
                if (event.currentTarget) {
                    this.state.record = !this.state.record;
                    $(event.currentTarget).find(".icon").toggleClass('led');
                }
            });
            $(".clear-all-btn").off("click").on("click", () => {
                this.state.requests = {};
                this.state.selectedRequest = {};
                this.state.count = 0;
                $("#property-table").find("tbody").html("");
                $("#event-list").html("");
            });
            $(".mixpanel-properties-btn").off("click").on("click", (event) => {
                if (event.currentTarget) {
                    this.state.omitMixpanelProperty = !this.state.omitMixpanelProperty;
                    $(event.currentTarget).find(".icon").toggleClass('check');
                }
            });
            $(".download-btn").off("click").on("click", () => {
                this.downloadObjectAsJson(this.state.requests, "request-list-mixpaneltool.json");
            });
        });
    }

    downloadObjectAsJson(exportObj, exportName) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    handleMixpanelRequest(requestObject) {
        if (this.state.record && this.isRequestValid(requestObject)) {
            let properties = {}
            try {
                let urlParams = this.getUrlParams(requestObject);
                properties = this.getProperties(urlParams.data);
                urlParams.data = properties;
                this.addRequest(urlParams);

            } catch (error) {
                properties = {};
            }
        }

    }

    isRequestValid(requestObject) {
        if (requestObject && requestObject.request && requestObject.request.url) {
            return this.mixpanelAPIPattern.test(requestObject.request.url);
        }
        return false;
    }

    getUrlParams(requestObject) {
        if (requestObject && requestObject.request && requestObject.request.queryString) {
            return requestObject.request.queryString.reduce((properties, newProperty) => {
                properties[newProperty.name] = newProperty.value;
                return properties;
            }, {});

        } else {
            return {};
        }

    }

    getProperties(dataParam) {
        return JSON.parse(atob(decodeURIComponent(dataParam)));
    }

    addRequest(mixpanelRequest) {
        ++this.state.count;
        let key = "key-" + this.state.count;
        this.state.requests[key] = mixpanelRequest;
        //initialise the data if it is first valid request
        if (this.state.count == 1) {
            this.state.selectedRequest = mixpanelRequest;
            this.displayRequest(key, true);
            this.displayProperties(key);
        } else {
            this.displayRequest(key, false);
        }
    }

    isMixpanelProperty(propKey) {
        return this.mixpanelProperties.indexOf(propKey) > -1;
    }

    getItemNode(key, index, eventName) {
        const itemTemplate = `<div class="item" data-key="${key}"><div class="content">
        <span class="sl-no">${index}</span><span class="event-name">${eventName}</span></div></div>`;
        return $(itemTemplate);
    }

    getPropertyRowNode(key, value) {

        if (typeof value === "object") {
            value = JSON.stringify(value, null, 2);
        }
        const rowTemplate = `<tr> <td class="prop-key">${key}</td><td class="prop-value"><span>${value}</span></td></tr>`;
        return $(rowTemplate);
    }

    displayRequest(key, isSelected) {
        let node = this.getItemNode(key, this.state.count, this.state.requests[key].data.event);
        node.off("click").on("click", (event) => {
            if (event.currentTarget && event.currentTarget.getAttribute) {
                let keyValue = event.currentTarget.getAttribute('data-key');
                $(".item").removeClass("active");
                $(event.currentTarget).removeClass("active").addClass("active");
                this.displayProperties(keyValue);
            }
        });
        if (isSelected) {
            node.toggleClass("active");
        }
        $("#event-list").append(node);
    }

    displayProperties(key) {

        if (!key) {
            return;
        }
        let tableNode = $("#property-table");
        if (!tableNode.hasClass("active")) {
            tableNode.addClass("active");
        }
        let tableBodyNode = tableNode.find("tbody");
        tableBodyNode.html("");
        let requestObject = this.state.requests[key].data;

        Object.keys(requestObject.properties).filter((objKey) => {

            if (this.isMixpanelProperty(objKey) && this.state.omitMixpanelProperty) {
                return;
            }
            let propRow = this.getPropertyRowNode(objKey, requestObject.properties[objKey]);
            tableBodyNode.append(propRow);
            return;
        });

    }
}

// ready function for jQuery
$(function () {
    // create mixpanel tool instance
    const mixpanelTool = new MixpanelTool();
    //subscribe to network requests and  detect mixpanel events
    devToolsNetworkListner(request => mixpanelTool.handleMixpanelRequest(request));
});