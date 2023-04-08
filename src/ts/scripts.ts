type parameterKey = string;

let shouldRedirect: boolean = false;
const BASE_URL: string = `${window.location.href}?q=`;
const DEFAULT_PROTOCOL: string = "https://";
const gaUrlKey: parameterKey = "analytics";

const hasValue = (variable: any, allowZeros: boolean = true): boolean => {
  return (
    variable !== null &&
    variable !== undefined &&
    variable !== "" &&
    // if it is a number, check that it is not zero
    (allowZeros || variable !== 0)
  );
}

const getUrlParameter = (key: parameterKey): string => {
  const queryString: string = window.location.search;
  const urlParams: URLSearchParams = new URLSearchParams(queryString);
  return urlParams.get(key) as string;
}

const getRequestedUrl = (): string => {
  const requestedUrlKey: parameterKey = "q" as parameterKey;
  return getUrlParameter(requestedUrlKey);
}

// embeds a new google analytics tag into the page
const embedGA = () => {
  const gaToken: string | undefined = getUrlParameter(gaUrlKey);

  // if there is no ga token specified, do not embed a ga script
  if (!hasValue(gaToken)) return;

  // add remote ga import from google cdn
  const gaImport = document.createElement("script");
  gaImport.async = true;
  gaImport.src = `https://www.googletagmanager.com/gtag/js?id=${gaToken}`;

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
}

// create a new URL when the user either clicks the "create" button or enter
let createRedirectURL = (): void => {
  const inputElementId: string = "new-redirect-url";
  const analyticsElementId: string = "analytics-input";

  const urlInput: string | undefined = (document.getElementById(inputElementId) as HTMLInputElement)?.value;
  const analyticsInput: string | undefined = (document.getElementById(analyticsElementId) as HTMLInputElement)?.value;

  if (urlInput !== undefined) {
    let reconstructedRequestedURL: string = encodeURIComponent(
      urlInput.indexOf("://") === -1 ? `${DEFAULT_PROTOCOL}${urlInput}` : urlInput
    );

    if (hasValue(analyticsInput)) {
      reconstructedRequestedURL += `&${gaUrlKey}=${analyticsInput}`;
    }

    // @ts-ignore
    (document.getElementById(inputElementId) as HTMLInputElement)?.value = `${BASE_URL}${reconstructedRequestedURL}`;
  }
}

let validateInput = (e: KeyboardEvent | undefined) => {
  if (typeof e === "undefined") return false;
  let keyCode = e.code || e.key;

  if (keyCode === "Enter") createRedirectURL();
}

// entry point for if a user should be redirected

const requestedUrl: string = getRequestedUrl();

// check for google analytics
embedGA();

// the user should be redirected
if (hasValue(requestedUrl)) {
  const redirectNoticeText: string = "You are about to be redirected to ";
  shouldRedirect = true;

  let redirectNoticeElement: string | undefined = document.getElementById("redirect-notice")?.innerText;
  if (redirectNoticeElement !== undefined) {
    redirectNoticeElement = `${redirectNoticeText} ${requestedUrl}`;
    window.location.href = requestedUrl;
  }
}
