import {getId} from './message-id';

/**
 * There are two possible kind of messages we can receive from native app:
 *     - RequestsFromNativeApp: native app initiates the dialog
 *     - ResponsesFromNativeApp: native app responds to a request initiated by the web
 */
type RequestsFromNativeApp = {
    NATIVE_EVENT: {
        type: 'NATIVE_EVENT';
        id: string;
        payload: {event: string};
    };
    SESSION_RENEWED: {
        type: 'SESSION_RENEWED';
        id: string;
        payload: {accessToken: string};
    };
    /**  https://confluence.tid.es/display/CTO/%5BAPPS%5D+Shared+Spec%3A+Top+Bar+customization#id-[APPS]SharedSpec:TopBarcustomization-Iconclickedcallbackbridgemethod */
    NAVIGATION_BAR_ICON_CLICKED: {
        type: 'NAVIGATION_BAR_ICON_CLICKED';
        id: string;
        payload: {id: string};
    };
};

export type SheetResponse = {
    action: 'SUBMIT' | 'DISMISS';
    result: Array<{
        id: string;
        selectedIds: Array<string>;
    }>;
};

export type SnackbarResponse = {
    action: 'DISMISS' | 'BUTTON' | 'TIMEOUT' | 'CONSECUTIVE';
};

type DataConnectionResponse = {
    connectionType: 'MOBILE' | 'WIFI ' | 'OTHER' | 'NONE';
    mobileConnectionType?:
        | '2G'
        | '3G'
        | '4G'
        | '5G'
        | 'OTHER'
        | 'PERMISSION_REQUIRED'
        | null;
    mobileCarrier?: string | null;
    mobileSignalStrength?:
        | 'NONE'
        | 'POOR'
        | 'MODERATE'
        | 'GOOD'
        | 'GREAT'
        | null;
};

export type ResponsesFromNativeApp = {
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
    TAC: {
        id: string;
        type: 'TAC';
        payload: {tac: string | null};
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
    BRIDGE_READY: {
        id: string;
        type: 'BRIDGE_READY';
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
        payload: SnackbarResponse;
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
            body: string;
        };
    };
    OS_PERMISSION_STATUS: {
        id: string;
        type: 'OS_PERMISSION_STATUS';
        payload: {
            granted: boolean;
        };
    };
    INTERNAL_NAVIGATION: {
        type: 'INTERNAL_NAVIGATION';
        id: string;
        payload: void;
    };
    DISMISS: {
        type: 'DISMISS';
        id: string;
        payload: void;
    };
    VIBRATION: {
        type: 'VIBRATION';
        id: string;
        payload: void;
    };
    FETCH_CONTACTS_DATA: {
        id: string;
        type: 'FETCH_CONTACTS_DATA';
        payload: Array<{
            phoneNumber: string;
            firstName?: string;
            middleName?: string;
            lastName?: string;
            encodedAvatar?: string;
        }>;
    };
    ADD_OR_EDIT_CONTACT: {
        id: string;
        type: 'ADD_OR_EDIT_CONTACT';
        payload: {
            phoneNumber: string;
            firstName?: string;
            middleName?: string;
            lastName?: string;
            encodedAvatar?: string;
        };
    };
    RENEW_SESSION: {
        type: 'RENEW_SESSION';
        id: string;
        payload: {accessToken: string};
    };
    GET_APP_METADATA: {
        type: 'GET_APP_METADATA';
        id: string;
        payload: {isInstalled: boolean; marketUrl: string; appUrl: string};
    };
    GET_DISK_SPACE_INFO: {
        type: 'GET_DISK_SPACE_INFO';
        id: string;
        payload: {availableBytes: number; totalBytes: number};
    };
    GET_ESIM_INFO: {
        type: 'GET_ESIM_INFO';
        id: string;
        payload: {supportsEsim: boolean; eid?: string | null};
    };
    SET_TRACKING_PROPERTY: {
        type: 'SET_TRACKING_PROPERTY';
        id: string;
        payload: void;
    };
    SET_ACTION_BEHAVIOR: {
        type: 'SET_ACTION_BEHAVIOR';
        id: string;
        payload: void;
    };
    HIGHLIGHT_TAB: {
        type: 'HIGHLIGHT_TAB';
        id: string;
        payload: void;
    };
    GET_TOPAZ_TOKEN: {
        type: 'GET_TOPAZ_TOKEN';
        id: string;
        payload: {token: string};
    };
    GET_TOPAZ_VALUES: {
        type: 'GET_TOPAZ_VALUES';
        id: string;
        payload: {syncId?: string};
    };
    LOG_OUT: {
        type: 'LOG_OUT';
        id: string;
        payload: {success: boolean};
    };
    SHOW_APP_RATING: {
        type: 'SHOW_APP_RATING';
        id: string;
        payload: void;
    };
    SHEET: {
        type: 'SHEET';
        id: string;
        payload: SheetResponse;
    };
    FETCH_PHONE_NUMBERS: {
        type: 'FETCH_PHONE_NUMBERS';
        id: string;
        payload: Array<{
            id: string;
            value: string;
        }>;
    };
    UPDATE_PHONE_NUMBERS: {
        type: 'UPDATE_PHONE_NUMBERS';
        id: string;
        payload: void;
    };
    GET_ATT_STATUS: {
        type: 'GET_ATT_STATUS';
        id: string;
        payload: {
            status: 'granted' | 'denied' | 'unknown';
        };
    };
    MODEL: {
        type: 'MODEL';
        id: string;
        payload: {model: string};
    };
    OPEN_ONBOARDING: {
        type: 'OPEN_ONBOARDING';
        id: string;
        payload: void;
    };
    DATA_CONNECTION_INFO: {
        type: 'DATA_CONNECTION_INFO';
        id: string;
        payload: DataConnectionResponse;
    };
    GET_PINCODE_INFO: {
        type: 'GET_PINCODE_INFO';
        id: string;
        payload: {
            status: 'enabled' | 'disabled';
        };
    };
    GET_PROFILE_IMAGE: {
        type: 'GET_PROFILE_IMAGE';
        id: string;
        payload: {
            image: string | null;
        };
    };
    START_PROFILE_IMAGE_FLOW: {
        type: 'START_PROFILE_IMAGE_FLOW';
        id: string;
        payload: {
            image: string | null;
            isCancelled: boolean;
        };
    };
    SHOW_LINE_SELECTOR: {
        type: 'SHOW_LINE_SELECTOR';
        id: string;
        payload: void;
    };
    TRIGGER_PIN_OR_BIOMETRIC_AUTHENTICATION: {
        type: 'TRIGGER_PIN_OR_BIOMETRIC_AUTHENTICATION';
        id: string;
        payload: {
            result:
                | 'USER_AUTHENTICATED'
                | 'USER_ENABLED_AUTHENTICATION'
                | 'LAST_AUTHENTICATION_STILL_VALID'
                | 'DEVICE_HAS_NO_AUTHENTICATION';
        };
    };
    FOCUS_NAVBAR: {
        type: 'FOCUS_NAVBAR';
        id: string;
        payload: {
            focused: boolean;
        };
    };
    SHARE_BASE64: {
        type: 'SHARE_BASE64';
        id: string;
        payload: void;
    };
    DOWNLOAD_BASE64: {
        type: 'DOWNLOAD_BASE64';
        id: string;
        payload: void;
    };
    GET_BATTERY_INFO: {
        type: 'GET_BATTERY_INFO';
        id: string;
        payload: {
            batteryLevel: number | null;
            isPowerSafeMode: boolean;
        };
    };
    CLIPBOARD_READ_TEXT: {
        type: 'CLIPBOARD_READ_TEXT';
        id: string;
        payload: string;
    };
    CLIPBOARD_WRITE_TEXT: {
        type: 'CLIPBOARD_WRITE_TEXT';
        id: string;
        payload: void;
    };
    SHOW_LOADING_OVERLAY: {
        type: 'SHOW_LOADING_OVERLAY';
        id: string;
        payload: void;
    };
    HIDE_LOADING_OVERLAY: {
        type: 'HIDE_LOADING_OVERLAY';
        id: string;
        payload: void;
    };
    GET_INSTALLATION_ID: {
        type: 'GET_INSTALLATION_ID';
        id: string;
        payload: {installationId: string};
    };
    GET_UNSEEN_NOTIFICATIONS_BADGE: {
        type: 'GET_UNSEEN_NOTIFICATIONS_BADGE';
        id: string;
        payload: {
            unseenNotificationCounter: number;
            lastUpdated: number;
        };
    };
    SET_UNSEEN_NOTIFICATIONS_BADGE: {
        type: 'SET_UNSEEN_NOTIFICATIONS_BADGE';
        id: string;
        payload: void;
    };
    REQUEST_DATAMOB_DEVICE_ADMIN: {
        type: 'REQUEST_DATAMOB_DEVICE_ADMIN';
        id: string;
        payload: {isAdmin: boolean};
    };
    REGISTER_DATAMOB_USER: {
        type: 'REGISTER_DATAMOB_USER';
        id: string;
        payload: void;
    };
    VALIDATE_DATAMOB_REQUIREMENTS: {
        type: 'VALIDATE_DATAMOB_REQUIREMENTS';
        id: string;
        payload: {
            deviceAdmin: boolean;
            lockPassword: boolean;
            accessibilityOption: boolean;
            invalidPhoneNumber: boolean;
            invalidToken: boolean;
        };
    };
    UNREGISTER_DATAMOB_DEVICE_ADMIN: {
        type: 'UNREGISTER_DATAMOB_DEVICE_ADMIN';
        id: string;
        payload: void;
    };
    DISPLAY_QUALTRICS_INTERCEPT: {
        type: 'DISPLAY_QUALTRICS_INTERCEPT';
        id: string;
        payload: {displayed: true};
    };
    SET_QUALTRICS_PROPERTIES: {
        type: 'SET_QUALTRICS_PROPERTIES';
        id: string;
        payload: void;
    };
    IS_QUALTRICS_INTERCEPT_AVAILABLE_FOR_USER: {
        type: 'IS_QUALTRICS_INTERCEPT_AVAILABLE_FOR_USER';
        id: string;
        payload: {isAvailable: boolean};
    };
    REFRESH_NAV_BAR: {
        type: 'REFRESH_NAV_BAR';
        id: string;
        payload: void;
    };
    GET_APP_DOMAIN: {
        type: 'GET_APP_DOMAIN';
        id: string;
        payload: {domain: string};
    };

    REQUEST_ALLOWME_BIOMETRICS: {
        type: 'REQUEST_ALLOWME_BIOMETRICS';
        id: string;
        payload: {
            result?: string;
            images: Array<string>;
        };
    };

    INCREASE_APP_RATING_TRIGGER: {
        type: 'INCREASE_APP_RATING_TRIGGER';
        id: string;
        payload: {
            key: string;
        };
    };
    RESET_APP_RATING_TRIGGER: {
        type: 'RESET_APP_RATING_TRIGGER';
        id: string;
        payload: {
            key: string;
        };
    };
    APP_RATING_REMIND_ME_LATER: {
        type: 'APP_RATING_REMIND_ME_LATER';
        id: string;
        payload: void;
    };
};

export type NativeAppResponsePayload<
    Type extends keyof ResponsesFromNativeApp,
> = ResponsesFromNativeApp[Type]['payload'];

type NativeAppRequestPayload<Type extends keyof RequestsFromNativeApp> =
    RequestsFromNativeApp[Type]['payload'];

type ResponseFromNative = ResponsesFromNativeApp[keyof ResponsesFromNativeApp];
type RequestFromNative = RequestsFromNativeApp[keyof RequestsFromNativeApp];

type RequestListener = (message: RequestFromNative) => void;
type ResponseListener = (message: ResponseFromNative) => void;
type MessageListener = RequestListener | ResponseListener;

const BRIDGE = '__tuenti_webview_bridge';

const hasAndroidPostMessage = () =>
    !!(
        typeof window !== 'undefined' &&
        window.tuentiWebView &&
        window.tuentiWebView.postMessage
    );

const hasWebKitPostMessage = () =>
    !!(
        typeof window !== 'undefined' &&
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.tuentiWebView &&
        window.webkit.messageHandlers.tuentiWebView.postMessage
    );

/**
 * Maybe returns postMessage function exposed by native apps
 */
const getWebViewPostMessage = (): NovumPostMessage | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    // Android
    if (hasAndroidPostMessage()) {
        return (jsonMessage) => {
            window.tuentiWebView!.postMessage!(jsonMessage);
        };
    }

    // iOS
    if (hasWebKitPostMessage()) {
        return (jsonMessage) => {
            window.webkit!.messageHandlers!.tuentiWebView!.postMessage!(
                jsonMessage,
            );
        };
    }

    return null;
};

let messageListeners: Array<MessageListener> = [];

const subscribe = (listener: MessageListener) => {
    messageListeners.push(listener);
};

const unsubscribe = (listener: MessageListener) => {
    messageListeners = messageListeners.filter((f) => f !== listener);
};

const isInIframe = () => {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
};

const isDisabledFromIframe = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    if (!isInIframe()) {
        return false;
    }

    return !window?.frameElement?.hasAttribute('data-enable-webview-bridge');
};

let log: undefined | ((...args: Array<any>) => void) = undefined;

export const setLogger = (logger: typeof log): void => {
    log = logger;
};

/**
 * Returns true if there is a WebView Bridge installed
 */
export const isWebViewBridgeAvailable = (): boolean =>
    !isDisabledFromIframe() &&
    (hasAndroidPostMessage() || hasWebKitPostMessage());

/**
 * Send message to native app and waits for response
 */
export const postMessageToNativeApp = <T extends keyof ResponsesFromNativeApp>(
    {type, id = getId(), payload}: {type: T; id?: string; payload?: Object},
    timeout?: number,
): Promise<NativeAppResponsePayload<T>> => {
    const postMessage = getWebViewPostMessage();
    const message = JSON.stringify({type, id, payload});
    log?.('[WebView Bridge] SEND:', message);

    if (!postMessage) {
        return Promise.reject({
            code: 500,
            reason: 'WebView postMessage not available',
        });
    }

    // ensure postMessage call is async
    setTimeout(() => {
        postMessage(message);
    });

    return new Promise((resolve, reject) => {
        let timedOut = false;

        const listener: ResponseListener = (response) => {
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
 * Initiates postMessage function, which will be called by native apps
 */
if (typeof window !== 'undefined') {
    // if there is already a bridge instance, we need to call it too when we receive a message
    const prevPostMessageImplementation = window[BRIDGE]?.postMessage;
    window[BRIDGE] = {
        postMessage: (jsonMessage: string) => {
            prevPostMessageImplementation?.(jsonMessage);
            log?.('[WebView Bridge] RCVD:', jsonMessage);
            let message: any;
            try {
                message = JSON.parse(jsonMessage);
            } catch (e) {
                throw Error(`Problem parsing webview message: ${jsonMessage}`);
            }
            messageListeners.forEach((f) => f(message));
        },
    };
}

export type NativeEventHandler = ({event}: {event: string}) => {
    action: 'default';
};

export const listenToNativeMessage = <T extends keyof RequestsFromNativeApp>(
    type: T,
    handler: (
        payload: NativeAppRequestPayload<T>,
    ) => Object | void | Promise<Object>,
): (() => void) => {
    const listener: RequestListener = (message) => {
        if (message.type === type) {
            Promise.resolve(handler(message.payload)).then(
                (responsePayload) => {
                    const postMessage = getWebViewPostMessage();
                    if (postMessage) {
                        postMessage(
                            JSON.stringify({
                                type: message.type,
                                id: message.id,
                                payload: responsePayload,
                            }),
                        );
                    }
                },
            );
        }
    };

    subscribe(listener);

    return () => {
        unsubscribe(listener);
    };
};

export const onNativeEvent = (
    eventHandler: NativeEventHandler,
): (() => void) => {
    const handler = (payload: NativeAppRequestPayload<'NATIVE_EVENT'>) => {
        const response = eventHandler({
            event: payload.event,
        });

        return {
            action: response.action || 'default',
        };
    };

    return listenToNativeMessage('NATIVE_EVENT', handler);
};

export const onSessionRenewal = (
    handler: (payload: {accessToken: string}) => void,
): (() => void) => listenToNativeMessage('SESSION_RENEWED', handler);
