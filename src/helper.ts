let authToken: string | null = null;

export function getQueryString(params: any) {
    const esc = encodeURIComponent;
    return Object.keys(params)
      .map((k) => esc(k) + "=" + esc(params[k]))
      .join("&");
}

export function setAuthToken(token: string | null) {
    authToken = token;
}

export function getAuthToken() {
    return authToken;
}

export function getRequestInit(): RequestInit {
    const defaultHeaders = new Headers();
    defaultHeaders.append("Content-Type", "application/json");
    defaultHeaders.append("pragma", "no-cache");
    defaultHeaders.append("cache-control", "no-cache");

    if (authToken) {
        defaultHeaders.append("X-AuthToken", authToken);
        return {
            credentials: "include",
            headers: defaultHeaders,
        };
    }

    return {
        headers: defaultHeaders,
    };
}

export function getPostRequestInit(data?: any): RequestInit {
    const requestInit = getRequestInit();
    requestInit.method = "POST";
    if (data !== undefined) {
        requestInit.body = JSON.stringify(data);
    }

    return requestInit;
}

export function getPutRequestInit(data?: any): RequestInit {
    const requestInit = getRequestInit();
    requestInit.method = "PUT";
    if (data !== undefined) {
        requestInit.body = JSON.stringify(data);
    }

    return requestInit;
}

export function getDeleteRequestInit(data?: any): RequestInit {
    const requestInit = getRequestInit();
    requestInit.method = "DELETE";
    if (data !== undefined) {
        requestInit.body = JSON.stringify(data);
    }

    return requestInit;
}
