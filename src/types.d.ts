type NovumPostMessage = (jsonMessage: string) => void;

type IosFirebase = {
    postMessage: (message: {command: string; [key: string]: any}) => void;
};

type AndroidFirebase = {
    logEvent: (name: string, eventJson: string) => void;
    setScreenName: (name: string) => void;
    setScreenNameWithParams?: (name: string, paramsJson: string) => void;
    setUserProperty: (name: string, value: string) => void;
};

interface Window {
    // iOS
    webkit?: {
        messageHandlers?: {
            tuentiWebView?: {
                postMessage?: NovumPostMessage;
            };
            firebase?: IosFirebase;
        };
    };

    // Android
    tuentiWebView?: {
        postMessage?: NovumPostMessage;
    };

    AnalyticsWebInterface?: AndroidFirebase;

    // Web
    __tuenti_webview_bridge?: {
        postMessage: NovumPostMessage;
    };

    gtag?: Gtag.Gtag;
}
