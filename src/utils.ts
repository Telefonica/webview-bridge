import {
    postMessageToNativeApp,
    isWebViewBridgeAvailable,
    NativeAppResponsePayload,
    listenToNativeMessage,
} from './post-message';

export const attachToEmail = ({
    url,
    subject,
    fileName,
    recipient,
    body,
}: {
    url: string;
    subject?: string;
    fileName: string;
    recipient?: string;
    body?: string;
}): Promise<void> =>
    postMessageToNativeApp({
        type: 'ATTACH_TO_EMAIL',
        payload: {url, subject, fileName, recipient, body},
    });

export type ShareOptions =
    | {
          text: string;
      }
    | {
          url: string;
          fileName: string;
          text?: string;
      };

export const share = (options: ShareOptions): Promise<void> =>
    postMessageToNativeApp({
        type: 'SHARE',
        payload: options,
    });

export type NavigationBarIcon = Readonly<{
    /** Identifier. The native side will notify the WebView when the icon is clicked using this id*/
    id: string;
    /** URL to be opened by the app as a deep-link if present */
    url?: string;
    /** Content description of the image used for accessibility */
    name: string;
    /**
     * This is a string whose value will be mapped to a local resource that the app already knows.
     * See https://void.tuenti.io/idl-server/files/TopNavbarIcon/1.1 for available values.
     * A fallback icon will be used if the app doesn't recognize the value.
     */
    iconEnum?: string;
    /**
     * Set of urls that the app will use to render the icon.
     * If both iconEnum and icon are received, the iconEnum should be used as a fallback in case there's some issue with the urls.
     */
    icon?: {
        /**
         * Those urls should be icons in PNG format.
         * The icons will not be rendered until the image has been downloaded by the app.
         * The URLs should be inmutable to allow the app to cache those icons for an arbitrary amount of time.
         */
        url: string;
        /** To be used if present when dark mode is activated. */
        urlDark?: string;
    };
    badge?: {
        /**
         * Boolean to determine if the badge should be shown
         * If `show` is `true` and number and nativeLogic are not present, the badge will be shown as a dot
         */
        show: boolean;
        /** Same logic and current same supported values as in nativeLogic field from API */
        nativeLogic?: 'INBOX' | 'PROFILE';
        /** Hardcoded value to set as the badge count. It will have more priority than nativeLogic. */
        number?: number;
    };
    /**
     * Tracking properties to be sent to analytics when the icon is clicked.
     * These properties will be merged to the tracking event produced by the native side
     */
    trackingProperties?: Record<string, string>;

    /**
     * Identifies the action, native app can then do specific logic for this action.
     * Ex: if sectionName matches a maintenanceMode id, it may show a maintenance message instead of the usual behaviour
     */
    sectionName?: string;
}>;

/**
 * Related doc: https://confluence.tid.es/pages/viewpage.action?spaceKey=CTO&title=%5BAPPS%5D+Shared+Spec%3A+Top+Bar+customization#id-[APPS]SharedSpec:TopBarcustomization-Tracking
 */
export const updateNavigationBar = (
    options: Readonly<{
        title?: string;
        expandedTitle?: string;
        showBackButton?: boolean;
        showReloadButton?: boolean;
        /** @deprecated New apps will ignore this field */
        showProfileButton?: boolean;
        backgroundColor?: string;
        leftActions?: ReadonlyArray<NavigationBarIcon>;
        rightActions?: ReadonlyArray<NavigationBarIcon>;
        /**
         * It defines how the icons and the text of the top bar should be tinted.
         * If null or unknown value is received, the initial colors set by the app or the last colorVariant set will be used
         */
        colorVariant?: 'INVERSE' | 'REGULAR' | null;
        /**
         * This is a flag used to indicate that the appearance of the top bar should be restored to its original state.
         * The other fields that may come in the same bridge call will be applied after the reset
         */
        resetToDefaultState?: boolean;
    }>,
): Promise<void> => {
    if (isWebViewBridgeAvailable()) {
        return postMessageToNativeApp({
            type: 'NAVIGATION_BAR',
            payload: options,
        });
    } else {
        if (options.title !== undefined && typeof document !== 'undefined') {
            document.title = options.title;
        }
        return Promise.resolve();
    }
};

/**
 * Returns the unsubscribe function. Should be called when the component is unmounted.
 */
export const onNavigationBarIconClicked = (
    handler: (payload: {id: string}) => void,
): (() => void) =>
    listenToNativeMessage('NAVIGATION_BAR_ICON_CLICKED', handler);

/**
 * @deprecated
 */
export const setWebViewTitle = (title: string): Promise<void> => {
    if (isWebViewBridgeAvailable()) {
        return updateNavigationBar({title});
    } else {
        if (typeof document !== 'undefined') {
            document.title = title;
        }
        return Promise.resolve();
    }
};

export const notifyPageLoaded = (): Promise<void> =>
    postMessageToNativeApp({type: 'PAGE_LOADED'});

export const notifyBridgeReady = (): Promise<void> =>
    postMessageToNativeApp({type: 'BRIDGE_READY'});

type RemoteConfig = {result: {[s: string]: string}};

let remoteConfig: null | RemoteConfig = null;

const isRemoteConfigAvailable = (key: string) =>
    (remoteConfig as RemoteConfig).result[key] === 'true';

export const getRemoteConfig = (): Promise<RemoteConfig> => {
    if (!remoteConfig) {
        // If GET_REMOTE_CONFIG takes more than 5s to respond resolve with empty result
        const timeoutP = new Promise<RemoteConfig>((resolve) => {
            setTimeout(() => {
                resolve({result: {}});
            }, 500);
        });

        const configP = postMessageToNativeApp({
            type: 'GET_REMOTE_CONFIG',
        }).then((res) => {
            remoteConfig = res;
            return {...remoteConfig};
        });

        return Promise.race([timeoutP, configP]);
    } else {
        return Promise.resolve({...remoteConfig});
    }
};

export const isABTestingAvailable = (key: string): Promise<boolean> =>
    getRemoteConfig()
        .then(() => isRemoteConfigAvailable(key))
        .catch(() => false);

export const reportStatus = ({
    feature,
    status,
    reason,
}: {
    feature: 'ACCOUNT';
    status: 'CRITICAL' | 'GOOD' | 'BAD';
    reason: string;
}): Promise<NativeAppResponsePayload<'STATUS_REPORT'>> =>
    postMessageToNativeApp({
        type: 'STATUS_REPORT',
        payload: {feature, status, reason},
    });

export const fetch = ({
    url,
    method,
    headers,
    body,
}: {
    url: string;
    method: 'GET' | 'POST';
    headers: {[key: string]: string};
    body: string;
}): Promise<NativeAppResponsePayload<'FETCH'>> => {
    return postMessageToNativeApp({
        type: 'FETCH',
        payload: {url, method, headers, body},
    }).catch(() => ({
        status: 500,
        headers: {},
        body: 'Bridge call failed',
    }));
};

type PermissionsStatus = 'notifications' | 'read-contacts' | 'write-contacts';

export const checkPermissionStatus = (
    feature: PermissionsStatus,
    params?: {[key: string]: string},
): Promise<boolean> =>
    postMessageToNativeApp({
        type: 'OS_PERMISSION_STATUS',
        payload: {
            feature,
            params: params,
        },
    }).then(({granted}) => granted);

export const getAppMetadata = (
    appToken: string,
): Promise<{isInstalled: boolean; marketUrl: string; appUrl: string}> =>
    postMessageToNativeApp({
        type: 'GET_APP_METADATA',
        payload: {
            appToken,
        },
    });

export const getNetworkConnectionInfo = (): Promise<
    NativeAppResponsePayload<'DATA_CONNECTION_INFO'>
> =>
    postMessageToNativeApp({
        type: 'DATA_CONNECTION_INFO',
        payload: {},
    });

type ActionBehavior =
    | {
          behavior: 'confirm';
          title: string;
          message: string;
          acceptText: string;
          cancelText: string;
      }
    | {
          behavior: 'default';
      }
    | {
          behavior: 'cancel';
      };

export const setActionBehavior = (actions: {
    webviewClose?: ActionBehavior;
    navigationBack?: ActionBehavior;
}): Promise<void> =>
    postMessageToNativeApp({
        type: 'SET_ACTION_BEHAVIOR',
        payload: {
            actions: actions,
        },
    }).catch(() => {
        // do nothing
    });

/**
 * Returns the Topaz SDK Token
 * https://www.topaz.com.br/ofd/index.php
 */
export const getTopazToken = (
    options: {timeout?: number} = {},
): Promise<{token: string}> =>
    postMessageToNativeApp(
        {
            type: 'GET_TOPAZ_TOKEN',
            payload: {},
        },
        options.timeout,
    );

export const getTopazValues = (): Promise<{syncId?: string}> =>
    postMessageToNativeApp({
        type: 'GET_TOPAZ_VALUES',
        payload: {},
    });

export const getPincodeInfo = (): Promise<{status: 'enabled' | 'disabled'}> =>
    postMessageToNativeApp({type: 'GET_PINCODE_INFO'});

export const triggerPinOrBiometricAuthentication = (
    maxSecondsSinceLastValidation: number,
): Promise<
    NativeAppResponsePayload<'TRIGGER_PIN_OR_BIOMETRIC_AUTHENTICATION'>
> =>
    postMessageToNativeApp({
        type: 'TRIGGER_PIN_OR_BIOMETRIC_AUTHENTICATION',
        payload: {maxSecondsSinceLastValidation},
    });

export const focusNavbar = (): Promise<{focused: boolean}> =>
    postMessageToNativeApp({type: 'FOCUS_NAVBAR'});

export const showLoadingOverlay = (payload: {
    /**
     * Whether the in animation is enabled (false by default)
     */
    inAnimation?: boolean;
    /**
     * Whether the out animation is enabled (false by default)
     */
    outAnimation?: boolean;
    /**
     * Minimum duration of the loop animation in milliseconds (0 by default)
     */
    minimumLoopDurationMs?: number;
    /**
     * whether the loop animation should be stopped immediately or not (true by default)
     */
    stopAnimationCycle?: boolean;
    /**
     * List of description texts to be shown one after the other
     */
    descriptions?: Array<string>;
    /**
     * Duration of each description in milliseconds (3000 by default)
     */
    descriptionDurationMs?: number;
    /**
     * After this timeout loading screen would be hidden automatically (20000 by default)
     */
    timeoutMs?: number;
    /**
     * (Only Android) If true, after loading screen has been hidden, if user presses android back button, webview window will close (true by default)
     */
    closeOnBackButtonPressAfterFinish?: boolean;
}): Promise<void> =>
    postMessageToNativeApp({type: 'SHOW_LOADING_OVERLAY', payload});

export const hideLoadingOverlay = (): Promise<void> =>
    postMessageToNativeApp({type: 'HIDE_LOADING_OVERLAY'});
