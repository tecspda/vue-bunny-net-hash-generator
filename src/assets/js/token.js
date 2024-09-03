import CryptoJS from "crypto-js";

function addCountries(url, a, b) {
    var tempUrl = url;
    if (a != null) {
        var tempUrlOne = new URL(tempUrl);
        tempUrl += ((tempUrlOne.search === "") ? "?" : "&") + "token_countries=" + a;
    }
    if (b != null) {
        var tempUrlTwo = new URL(tempUrl);
        tempUrl += ((tempUrlTwo.search === "") ? "?" : "&") + "token_countries_blocked=" + b;
    }
    return tempUrl;
}

export function signUrl(url, securityKey, expirationTime = 3600, userIp, isDirectory = false, pathAllowed, countriesAllowed, countriesBlocked) {
    let parameterData = "", parameterDataUrl = "", signaturePath = "", hashableBase = "", token = "";
    const expires = Math.floor(new Date().getTime() / 1000) + expirationTime;
    url = addCountries(url, countriesAllowed, countriesBlocked);
    const parsedUrl = new URL(url);
    const parameters = new URLSearchParams(parsedUrl.search);

    if (pathAllowed !== "") {
        signaturePath = pathAllowed;
        parameters.set("token_path", signaturePath);
    } else {
        signaturePath = decodeURIComponent(parsedUrl.pathname);
    }

    const sortedParams = Array.from(parameters.entries()).sort();
    for (const [key, value] of sortedParams) {
        if (value === "") continue;
        if (parameterData.length > 0) parameterData += "&";
        parameterData += `${key}=${value}`;
        parameterDataUrl += `&${key}=${encodeURIComponent(value)}`;
    }

    // Генерация хеша с использованием CryptoJS
    hashableBase = securityKey + signaturePath + expires + (userIp ? userIp : "") + parameterData;
    token = CryptoJS.SHA256(hashableBase).toString(CryptoJS.enc.Base64);
    token = token.replace(/\n/g, "").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

    if (isDirectory) {
        return `${parsedUrl.protocol}//${parsedUrl.host}/bcdn_token=${token}${parameterDataUrl}&expires=${expires}${parsedUrl.pathname}`;
    } else {
        return `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}?token=${token}${parameterDataUrl}&expires=${expires}`;
    }
}
