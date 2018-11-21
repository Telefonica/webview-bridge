type PostMessage = (jsonMessage: string) => void;

/**
 * Maybe returns postMessage function exposed by native apps
 */
const getWebViewPostMessage = (): PostMessage | null => {
    // iOS
    if (
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.tuentiWebView &&
        window.webkit.messageHandlers.tuentiWebView.postMessage
    ) {
        return jsonMessage => {
            console.log('postMessage to iOS WebView', jsonMessage);
            window.webkit.messageHandlers.tuentiWebView.postMessage(jsonMessage);
        };
    }

    // Android
    if (window.tuentiWebView && window.tuentiWebView.postMessage) {
        return jsonMessage => {
            console.log('postMessage to Android WebView', jsonMessage);
            window.tuentiWebView.postMessage(jsonMessage);
        };
    }

    console.log('no WebView bridge found');
    return null;
};
