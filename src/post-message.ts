import {getId} from './message-id';

type MessageTypeToResponseMap = {
    SIM_ICC: {
        id: string;
        type: 'SIM_ICC';
        payload: {icc: string};
    };
    IMEI: {
        id: string;
        type: 'IMEI';
        payload: {imei: string};
    };
    IMSI: {
        id: string;
        type: 'IMSI';
        payload: {imsi: string};
    };
    ATTACH_TO_EMAIL: {
        id: string;
        type: 'ATTACH_TO_EMAIL';
        payload: void;
    };
    SET_TITLE: {
        id: string;
        type: 'SET_TITLE';
        payload: void;
    };
    PAGE_LOADED: {
        id: string;
        type: 'PAGE_LOADED';
        payload: void;
    };
    ALERT: {
        id: string;
        type: 'ALERT';
        payload: void;
    };
    MESSAGE: {
        id: string;
        type: 'MESSAGE';
        payload: void;
    };
    CONFIRM: {
        id: string;
        type: 'CONFIRM';
        payload: {result: boolean};
    };
    CREATE_CALENDAR_EVENT: {
        id: string;
        type: 'CREATE_CALENDAR_EVENT';
        payload: void;
    };
    GET_CONTACT_DATA: {
        id: string;
        type: 'GET_CONTACT_DATA';
        payload: {
            name?: string;
            email?: string;
            phoneNumber?: string;
            address?: {
                street?: string;
                city?: string;
                country?: string;
                postalCode?: string;
            };
        };
    };
    ERROR: {
        id: string;
        type: 'ERROR';
        payload: {code: number; reason: string};
    };
};

type Response = MessageTypeToResponseMap[keyof MessageTypeToResponseMap];
type Listener = (message: Response) => void;

const BRIDGE = '__tuenti_webview_bridge';

const hasAndroidPostMessage = () =>
    !!(window.tuentiWebView && window.tuentiWebView.postMessage);

const hasWebKitPostMessage = () =>
    !!(
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.tuentiWebView &&
        window.webkit.messageHandlers.tuentiWebView.postMessage
    );

/**
 * Maybe returns postMessage function exposed by native apps
 */
const getWebViewPostMessage = (): NovumPostMessage | null => {
    // Android
    if (hasAndroidPostMessage()) {
        return jsonMessage => {
            console.log('postMessage to Android WebView', jsonMessage);
            window!.tuentiWebView!.postMessage!(jsonMessage);
        };
    }

    // iOS
    if (hasWebKitPostMessage()) {
        return jsonMessage => {
            console.log('postMessage to iOS WebView', jsonMessage);
            window.webkit!.messageHandlers!.tuentiWebView!.postMessage!(
                jsonMessage,
            );
        };
    }

    return null;
};

let messageListeners: Listener[] = [];

const subscribe = (listener: Listener) => {
    messageListeners.push(listener);
};

const unsubscribe = (listener: Listener) => {
    messageListeners = messageListeners.filter(f => f !== listener);
};

/**
 * Returns true if there is a WebView Bridge installed
 */
export const isWebViewBridgeAvailable = (): boolean =>
    hasAndroidPostMessage() || hasWebKitPostMessage();

/**
 * Send message to native app
 */
export const postMessageToNativeApp = <
    T extends keyof MessageTypeToResponseMap
>(
    {type, id = getId(), payload}: {type: T; id?: string; payload?: Object},
    timeout?: number,
): Promise<MessageTypeToResponseMap[T]['payload']> => {
    const postMessage = getWebViewPostMessage();

    if (!postMessage) {
        return Promise.reject();
    }

    const message = JSON.stringify({type, id, payload});

    if (!postMessage) {
        return Promise.reject({
            code: 500,
            reason: 'WebView postMessage not available',
        });
    }

    postMessage(message);

    return new Promise((resolve, reject) => {
        let timedOut = false;

        const listener = (response: MessageTypeToResponseMap[T]): void => {
            if (response.id === id && !timedOut) {
                if (response.type === type) {
                    resolve(response.payload);
                } else if (response.type === 'ERROR') {
                    reject(response.payload);
                } else {
                    reject({
                        code: 500,
                        reason: `bad type: ${response.type}. Expecting ${type}`,
                    });
                }
                unsubscribe(listener);
            }
        };

        subscribe(listener);

        if (timeout) {
            setTimeout(() => {
                timedOut = true;
                unsubscribe(listener);
                reject({code: 408, reason: 'request timeout'});
            }, timeout);
        }
    });
};

/**
 * Initiates WebApp postMessage function, which will be called by native apps
 */
window[BRIDGE] = window[BRIDGE] || {
    postMessage: (jsonMessage: string) => {
        let message: Response;
        try {
            message = JSON.parse(jsonMessage);
        } catch (e) {
            throw Error(`Problem parsing webview message: ${jsonMessage}`);
        }
        messageListeners.forEach(f => f(message));
    },
};
