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
  constructor(customAPIHost) {
    this.state = {
      requests: {},
      selectedRequest: {},
      count: 0,
      customAPIHost: customAPIHost || "",
      omitMixpanelProperty: true,
      record: true,
    };
    this.mixpanelAPIPattern = MIXPANEL_API_PATTERN;
    this.mixpanelProperties = MIXPANEL_PROPERTIES;
    this.bindEvents();
  }

  bindEvents() {
    $(() => {
      $(".record-btn")
        .off("click")
        .on("click", (event) => {
          if (event.currentTarget) {
            this.state.record = !this.state.record;
            $(event.currentTarget).find(".icon").toggleClass("led");
          }
        });
      $(".clear-all-btn")
        .off("click")
        .on("click", () => {
          this.state.requests = {};
          this.state.selectedRequest = {};
          this.state.count = 0;
          $("#property-table").find("tbody").html("");
          $("#event-list").html("");
        });
      $(".mixpanel-properties-btn")
        .off("click")
        .on("click", (event) => {
          if (event.currentTarget) {
            this.state.omitMixpanelProperty = !this.state.omitMixpanelProperty;
            $(event.currentTarget).find(".icon").toggleClass("check");
          }
        });
      $(".download-btn")
        .off("click")
        .on("click", () => {
          this.downloadObjectAsJson(
            this.state.requests,
            "request-list-mixpaneltool.json"
          );
        });
      $("#custom-api-host-input")
        .off("input")
        .on("input", (event) => {
          let value = event && event.target ? event.target.value : "";
          const customAPIHost = value.trim().toLowerCase();
          this.customAPIHost = customAPIHost;
          saveCustomHost(customAPIHost);
        });

      $("#custom-api-host-input").val(this.state.customAPIHost || "");

      $("#scroll-up-btn")
        .off("click")
        .on("click", () => {
          this.scrollToTop();
        });

      $("#details-column")
        .off("scroll")
        .on("scroll", (e) => {
          const isScrollable = e.target.clientHeight < e.target.scrollHeight;
          console.log(e, isScrollable);
          if (isScrollable && e.target.scrollTop > 50) {
            $("#scroll-up-btn").show();
          } else {
            $("#scroll-up-btn").hide();
          }
        });
    });
  }

  showBatchedRequestsAreEnabled() {
    $("#batched-request-id").css("visibility", "visible");
  }

  downloadObjectAsJson(exportObj, exportName) {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  /**
   * handling mixpanel requests
   *
   * @param {*} requestObject
   * @memberof MixpanelTool
   */
  handleMixpanelRequest(requestObject) {
    if (this.state.record && this.isRequestValid(requestObject)) {
      let properties = {};
      let encodedData = "";
      let mixpanelRequest = {};
      let urlParams = "";

      try {
        /* currently 3 methods are allowed-methods GET,POST & OPTIONS */

        // GET
        if (requestObject.request.method === "GET") {
          urlParams = this.getUrlParams(requestObject);
          encodedData = urlParams.data || "";
          properties = this.getProperties(encodedData);
          mixpanelRequest = Object.assign({}, urlParams, {
            data: properties,
          });
          this.addRequest(mixpanelRequest);
        }
        // POST
        if (requestObject.request.method === "POST") {
          encodedData = this.getDataParams(requestObject);
          urlParams = this.getUrlParams(requestObject);
          properties = this.getProperties(encodedData);

          // check properties are request-batching/queueing/retry - batch_requests: true,
          // ref: https://developer.mixpanel.com/docs/javascript-full-api-reference
          if (Array.isArray(properties)) {
            this.showBatchedRequestsAreEnabled(); // show notification
            properties.forEach((property) => {
              if (property.event) {
                mixpanelRequest = Object.assign({}, urlParams, {
                  data: property,
                });
                this.addRequest(mixpanelRequest);
              }
            });
          } else {
            // check properties are request-batching/queueing/retry - batch_requests: false,
            if (properties.event) {
              mixpanelRequest = Object.assign({}, urlParams, {
                data: properties,
              });
              this.addRequest(mixpanelRequest);
            }
          }
        }
      } catch (error) {
        console.error("error", error);
      }
    }
  }

  isRequestValid(requestObject) {
    if (requestObject && requestObject.request && requestObject.request.url) {
      let isMixpanelURL = this.mixpanelAPIPattern.test(
        requestObject.request.url
      );
      let customAPIHost = this.customAPIHost;
      if (isMixpanelURL) {
        return true;
      } else if (
        customAPIHost &&
        requestObject.request.url.includes(customAPIHost)
      ) {
        return true;
      }
    }

    return false;
  }

  getUrlParams(requestObject) {
    if (
      requestObject &&
      requestObject.request &&
      requestObject.request.queryString
    ) {
      return requestObject.request.queryString.reduce(
        (properties, newProperty) => {
          properties[newProperty.name] = newProperty.value;
          return properties;
        },
        {}
      );
    } else {
      return {};
    }
  }

  getDataParams(requestObject) {
    if (
      requestObject &&
      requestObject.request &&
      requestObject.request.postData
    ) {
      let params = requestObject.request.postData.params;
      params = Array.isArray(params) ? params : [];
      /* params is the array of {name , value  } object */
      return params.reduce((param) => {
        return param.name == "data";
      }).value;
    } else {
      return "";
    }
  }

  /*
   Ref: https://github.com/mixpanel/mixpanel-js/releases/tag/v2.43.0
   Mixpanel has changed the payload ecoding format, by default JSON string will be
   passed, unless api_payload_format:true is specified. 
  */
  base64regex =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

  getProperties(dataParam) {
    let dataStr = decodeURIComponent(dataParam);
    // if Base64
    if (this.base64regex.test(dataStr)) {
      dataStr = atob(dataStr);
    }
    return JSON.parse(dataStr);
  }

  addRequest(mixpanelRequest) {
    ++this.state.count;
    let key = "event-" + this.state.count;
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
    let node = this.getItemNode(
      key,
      this.state.count,
      this.state.requests[key].data.event
    );
    node.off("click").on("click", (event) => {
      if (event.currentTarget && event.currentTarget.getAttribute) {
        let keyValue = event.currentTarget.getAttribute("data-key");
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
      let propRow = this.getPropertyRowNode(
        objKey,
        requestObject.properties[objKey]
      );
      tableBodyNode.append(propRow);
      return;
    });
  }

  scrollToTop() {
    $("#details-column").animate(
      {
        scrollTop: 0,
      },
      2000
    );
  }

  manageScrollToTop() {
    // When the user scrolls down 20px from the top of the document, show the button
    const detailsColumn = document.querySelector("#details-column");
    if (detailsColumn && detailsColumn.onscroll) {
      detailsColumn.onscroll = () => {
        console.log("onscroll");
        if (detailsColumn.scrollTop > 50) {
          $("#scroll-up-btn").show();
        } else {
          $("#scroll-up-btn").hide();
        }
      };
    }
  }
}

getSavedCustomHost = async () => {
  try {
    const result = await chrome.storage.sync.get("SAVED_URL_KEY");
    const value = result.SAVED_URL_KEY;
    if (!value || typeof value !== "string") {
      throw Error("value undefined");
    }
    return value;
  } catch (e) {
    console.error("getSavedCustomHost", e);
    return "";
  }
};

const saveCustomHost = async (customHost) => {
  try {
    await chrome.storage.sync.set({ SAVED_URL_KEY: customHost });
    return true;
  } catch (e) {
    console.error("saveCustomHost", e);
    return false;
  }
};

// ready function for jQuery
$(() => {
  getSavedCustomHost().then((customHost) => {
    // create mixpanel tool instance
    const mixpanelTool = new MixpanelTool(customHost);
    //subscribe to network requests and  detect mixpanel events
    devToolsNetworkListner((request) =>
      mixpanelTool.handleMixpanelRequest(request)
    );

    for (let i = 1; i < 50; i++) {
      let properties = {};
      for (let j = 1; j < 500; j++) {
        properties["test-property-" + j] =
          i +
          " new-valuenew- new-value new-valuenew-valuenew-value new-valuenew-valuenew-value valuenew-valuenew-valuenew-value new-valuenew-valuenew-value " +
          j;
      }
      mixpanelTool.addRequest({
        data: { properties, event: "event-" + i },
      });
    }
  });
});
