import {getId} from './message-id';

/**
 * This type map represents all the possible messages we can receive from native app
 * Those messages can be:
 *     - Requests: native app initiates the dialog
 *     - Responses: native app responds to a request initiated by the web
 */
type IncomingMessageMap = {
    // Requests
    EVENT: {
        type: 'NATIVE_EVENT';
        id: string;
        payload: {event: string};
    };
    // Responses
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
    NAVIGATION_BAR: {
        id: string;
        type: 'NAVIGATION_BAR';
        payload: void;
    };
    SHARE: {
        id: string;
        type: 'SHARE';
        payload: void;
    };
    ERROR: {
        id: string;
        type: 'ERROR';
        payload: {code: number; reason: string};
    };
    GET_REMOTE_CONFIG: {
        id: string;
        type: 'GET_REMOTE_CONFIG';
        payload: {result: {[s: string]: string}};
    };
    STATUS_REPORT: {
        id: string;
        type: 'STATUS_REPORT';
        payload: void;
    };
    FETCH: {
        id: string;
        type: 'FETCH';
        payload: {
            status: number;
            headers: {[key: string]: string};
            data: string;
        };
    };
};

type Response = IncomingMessageMap[keyof IncomingMessageMap];
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
            window!.tuentiWebView!.postMessage!(jsonMessage);
        };
    }

    // iOS
    if (hasWebKitPostMessage()) {
        return jsonMessage => {
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
 * Send message to native app and waits for response
 */
export const postMessageToNativeApp = <T extends keyof IncomingMessageMap>(
    {type, id = getId(), payload}: {type: T; id?: string; payload?: Object},
    timeout?: number,
): Promise<IncomingMessageMap[T]['payload']> => {
    const postMessage = getWebViewPostMessage();

    if (!postMessage) {
        return Promise.reject({
            code: 500,
            reason: 'WebView postMessage not available',
        });
    }

    const message = JSON.stringify({type, id, payload});

    // ensure postMessage call is async
    setTimeout(() => {
        postMessage(message);
    });

    return new Promise((resolve, reject) => {
        let timedOut = false;

        const listener: Listener = response => {
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

export type NativeEventHandler = ({
    event,
}: {
    event: string;
}) => {action: 'default'};

export const onNativeEvent = (handler: NativeEventHandler) => {
    const listener: Listener = message => {
        if (message.type === 'NATIVE_EVENT') {
            const response = handler({
                event: message.payload.event,
            });

            const postMessage = getWebViewPostMessage();
            if (postMessage) {
                postMessage(
                    JSON.stringify({
                        type: 'NATIVE_EVENT',
                        id: message.id,
                        payload: {
                            action: response.action || 'default',
                        },
                    }),
                );
            }
        }
    };
    subscribe(listener);

    return () => {
        unsubscribe(listener);
    };
};
