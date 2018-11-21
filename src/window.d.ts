interface Window {
    // iOS
    webkit?: {
        messageHandlers?: {
            tuentiWebView?: {
                postMessage?: PostMessage;
            };
        };
    };

    // Android
    tuentiWebView?: {
        postMessage?: PostMessage;
    };
}
