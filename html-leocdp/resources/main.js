var parseDataUTM =
  window.parseDataUTM ||
  function () {
    if (location.search.indexOf("utm_") > 0) {
      var search = location.search.substring(1);
      var json = decodeURI(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"');
      return JSON.parse('{"' + json + '"}');
    }
  };

// (2) LEO OBSERVER: set-up all event tracking functions
var LeoObserver = {};

// (2.1) function to track View Event "PageClose"
LeoObserver.recordEventPageClose = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordViewEvent("page-close", eventData);
};

// (2.2) function to track View Event "AdImpression"
LeoObserver.recordEventAdImpression = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordViewEvent("ad-impression", eventData);
};

// (2.3) function to track View Event "PageView"
LeoObserver.recordEventPageView = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordViewEvent("page-view", eventData);
};

// (2.4) function to track View Event "AcceptTracking"
LeoObserver.recordEventAcceptTracking = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordViewEvent("accept-tracking", eventData);
};

// (2.5) function to track Action Event "Like"
LeoObserver.recordEventLike = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordActionEvent("like", eventData);
};

// (2.6) function to track View Event "ContentView"
LeoObserver.recordEventContentView = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordViewEvent("content-view", eventData);
};

// (2.7) function to track Action Event "Search"
LeoObserver.recordEventSearch = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordActionEvent("search", eventData);
};

// (2.8) function to track View Event "click-to-download"
LeoObserver.recordClickToDownload = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordViewEvent("click-to-download", eventData);
};

// (2.9) function to track Action Event "ClickDetails"
LeoObserver.recordEventClickDetails = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordActionEvent("click-details", eventData);
};

// (2.10) function to track Action Event "PlayVideo"
LeoObserver.recordEventPlayVideo = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordActionEvent("play-video", eventData);
};

// (2.11) function to track Action Event "SubmitContact"
LeoObserver.recordEventSubmitContact = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordActionEvent("submit-contact", eventData);
};

// (2.12) function to track Action Event "RegisterAccount"
LeoObserver.recordEventRegisterAccount = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordActionEvent("register-account", eventData);
};

// (2.13) function to track Action Event "UserLogin"
LeoObserver.recordEventUserLogin = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordActionEvent("user-login", eventData);
};

// (2.14) function to track Action Event "ShortLinkClick"
LeoObserver.recordEventShortLinkClick = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordActionEvent("short-link-click", eventData);
};

// (2.15) function to track Action Event "AskQuestion"
LeoObserver.recordEventAskQuestion = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordActionEvent("ask-question", eventData);
};

// (2.16) function to track Action Event "ProductTrial"
LeoObserver.recordEventProductTrial = function (eventData) {
  eventData = eventData ? eventData : {};
  LeoObserverProxy.recordActionEvent("product-trial", eventData);
};

// (3) LEO OBSERVER is ready
function leoObserverProxyReady(session) {
  // auto tracking when LEO CDP JS is ready
  LeoObserver.recordEventPageView(parseDataUTM());

  // set tracking LEO visitor ID into all a[href] nodes
  LeoObserverProxy.synchLeoVisitorId(function (vid) {
    var aNodes = document.querySelectorAll("a");
    [].forEach.call(aNodes, function (aNode) {
      var hrefUrl = aNode.href || "";
      var check =
        hrefUrl.indexOf("http") >= 0 && hrefUrl.indexOf(location.host) < 0;
      if (check) {
        if (hrefUrl.indexOf("?") > 0) hrefUrl += "&leosyn=" + vid;
        else hrefUrl += "?leosyn=" + vid;
        aNode.href = hrefUrl;
        console.log(hrefUrl);
      }
    });
    if (typeof window.synchLeoCdpToGA4 === "function") {
      window.synchLeoCdpToGA4(vid);
    }
  });
}

function tryDemoLeoCDP() {
  LeoObserver.recordEventProductTrial({
    trial_source: "leocdp_website_demo_section",
    trial_product: "leocdp_demo_platform",
  });
}

function downloadLeoCDP() {
  LeoObserver.recordClickToDownload({
    trial_source: "leocdp_website_download_button",
    trial_product: "leocdp_framework",
  });
}

function openNewsletterModal(triggerSource = "manual") {
  const modalEl = document.getElementById("newsletterModal");
  if (!modalEl) {
    console.error("Newsletter modal not found");
    return;
  }

  // Track modal view (safe, non-breaking)
  if (
    window.LeoObserver &&
    typeof LeoObserver.recordEventContentView === "function"
  ) {
    LeoObserver.recordEventContentView({
      content_type: "newsletter_modal",
      trigger_source: triggerSource,
    });
  }

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl, {
    backdrop: "static",
    keyboard: true,
  });

  modal.show();
}

$(document).ready(function () {
  handleNewsletterSubmit();
});

// Handle submit (no backend yet)
function handleNewsletterSubmit() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Optional tracking
    if (
      window.LeoObserver &&
      typeof LeoObserver.recordEventSubmitContact === "function"
    ) {
      LeoObserver.recordEventSubmitContact({
        source: "newsletter_modal",
        email: $("#newsletterEmail").val(),
      });
    }

    form.reset();

    $(form).hide();
    $("#newsletterSuccessMessage").show();

    // Close modal after a delay
    setTimeout(() => {
      bootstrap.Modal.getInstance(
        document.getElementById("newsletterModal"),
      ).hide();
    }, 3000);
  });
}
