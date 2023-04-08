var _a;
var shouldRedirect = false;
var BASE_URL = window.location.href + "?q=";
var DEFAULT_PROTOCOL = "https://";
var gaUrlKey = "analytics";
var hasValue = function (variable, allowZeros) {
    if (allowZeros === void 0) { allowZeros = true; }
    return (variable !== null &&
        variable !== undefined &&
        variable !== "" &&
        // if it is a number, check that it is not zero
        (allowZeros || variable !== 0));
};
var getUrlParameter = function (key) {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    return urlParams.get(key);
};
var getRequestedUrl = function () {
    var requestedUrlKey = "q";
    return getUrlParameter(requestedUrlKey);
};
// embeds a new google analytics tag into the page
var embedGA = function () {
    var gaToken = getUrlParameter(gaUrlKey);
    // if there is no ga token specified, do not embed a ga script
    if (!hasValue(gaToken))
        return;
    // add remote ga import from google cdn
    var gaImport = document.createElement("script");
    gaImport.async = true;
    gaImport.src = "https://www.googletagmanager.com/gtag/js?id=" + gaToken;
    document.body.appendChild(gaImport);
    // run the ga script
    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore
    function gtag() { dataLayer.push(arguments); }
    // @ts-ignore
    gtag("js", new Date());
    // @ts-ignore
    gtag("config", gaToken);
};
// create a new URL when the user either clicks the "create" button or enter
var createRedirectURL = function () {
    var _a, _b, _c;
    var inputElementId = "new-redirect-url";
    var analyticsElementId = "analytics-input";
    var urlInput = (_a = document.getElementById(inputElementId)) === null || _a === void 0 ? void 0 : _a.value;
    var analyticsInput = (_b = document.getElementById(analyticsElementId)) === null || _b === void 0 ? void 0 : _b.value;
    if (urlInput !== undefined) {
        var reconstructedRequestedURL = encodeURIComponent(urlInput.indexOf("://") === -1 ? "" + DEFAULT_PROTOCOL + urlInput : urlInput);
        if (hasValue(analyticsInput)) {
            reconstructedRequestedURL += "&" + gaUrlKey + "=" + analyticsInput;
        }
        // @ts-ignore
        (_c = document.getElementById(inputElementId)) === null || _c === void 0 ? void 0 : _c.value = "" + BASE_URL + reconstructedRequestedURL;
    }
};
var validateInput = function (e) {
    if (typeof e === "undefined")
        return false;
    var keyCode = e.code || e.key;
    if (keyCode === "Enter")
        createRedirectURL();
};
// entry point for if a user should be redirected
var requestedUrl = getRequestedUrl();
// check for google analytics
embedGA();
// the user should be redirected
if (hasValue(requestedUrl)) {
    var redirectNoticeText = "You are about to be redirected to ";
    shouldRedirect = true;
    var redirectNoticeElement = (_a = document.getElementById("redirect-notice")) === null || _a === void 0 ? void 0 : _a.innerText;
    if (redirectNoticeElement !== undefined) {
        redirectNoticeElement = redirectNoticeText + " " + requestedUrl;
        window.location.href = requestedUrl;
    }
}
