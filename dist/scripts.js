"use strict";
var _a;
var shouldRedirect = false;
var BASE_URL = window.location.href + "?q=";
var DEFAULT_PROTOCOL = "https://";
var hasValue = function (variable, allowZeros) {
    if (allowZeros === void 0) { allowZeros = true; }
    return (variable !== null &&
        variable !== undefined &&
        variable !== "" &&
        (allowZeros || variable !== 0));
};
var getRequestedUrl = function () {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    return urlParams.get("q");
};
var createRedirectURL = function () {
    var _a, _b;
    var inputElementId = "new-redirect-url";
    var urlInput = (_a = document.getElementById(inputElementId)) === null || _a === void 0 ? void 0 : _a.value;
    if (urlInput !== undefined) {
        var refinedRequestedURL = encodeURIComponent(urlInput.indexOf("://") === -1 ? "" + DEFAULT_PROTOCOL + urlInput : urlInput);
        (_b = document.getElementById(inputElementId)) === null || _b === void 0 ? void 0 : _b.value = "" + BASE_URL + refinedRequestedURL;
    }
};
var validateInput = function (e) {
    if (typeof e === "undefined")
        return false;
    var keyCode = e.code || e.key;
    if (keyCode === "Enter")
        createRedirectURL();
};
var requestedUrl = getRequestedUrl();
if (hasValue(requestedUrl)) {
    var redirectNoticeText = "You are about to be redirected to ";
    shouldRedirect = true;
    var redirectNoticeElement = (_a = document.getElementById("redirect-notice")) === null || _a === void 0 ? void 0 : _a.innerText;
    if (redirectNoticeElement !== undefined) {
        redirectNoticeElement = redirectNoticeText + " " + requestedUrl;
        window.location.href = requestedUrl;
    }
}
