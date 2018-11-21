type NovumPostMessage = (jsonMessage: string) => void;

interface Window {
    // iOS
    webkit?: {
        messageHandlers?: {
            tuentiWebView?: {
                postMessage?: NovumPostMessage;
            };
        };
    };

    // Android
    tuentiWebView?: {
        postMessage?: NovumPostMessage;
    };

    // Web
    __tuenti_webview_bridge?: {
        postMessage: NovumPostMessage;
    };
}
