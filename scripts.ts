let shouldRedirect: boolean = false;
const BASE_URL: string = `${window.location.href}?q=`;
const DEFAULT_PROTOCOL: string = "https://";


const hasValue = (variable: any, allowZeros: boolean = true) => {
  return (
    variable !== null &&
    variable !== undefined &&
    variable !== "" &&
    // if it is a number, check that it is not zero
    (allowZeros || variable !== 0)
  );
}

const getRequestedUrl = () => {
  const queryString: string = window.location.search;
  const urlParams: URLSearchParams = new URLSearchParams(queryString);
  return urlParams.get("q") as string;
}

// create a new URL when the user either clicks the "create" button or enter
let createRedirectURL = () => {
  const inputElementId: string = "new-redirect-url";
  let urlInput: string | undefined = (document.getElementById(inputElementId) as HTMLInputElement)?.value;

  if (urlInput !== undefined) {
    const refinedRequestedURL = encodeURIComponent(
      urlInput.indexOf("://") === -1 ? `${DEFAULT_PROTOCOL}${urlInput}` : urlInput
    );

    // @ts-ignore
    (document.getElementById(inputElementId) as HTMLInputElement)?.value = `${BASE_URL}${refinedRequestedURL}`;
  }
}

let validateInput = (e: KeyboardEvent | undefined) => {
  if (typeof e === "undefined") return false;
  let keyCode = e.code || e.key;

  if (keyCode === "Enter") createRedirectURL();
}

// entry point for if a user should be redirected

const requestedUrl: string = getRequestedUrl();

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
