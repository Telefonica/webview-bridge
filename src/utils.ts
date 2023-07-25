import {
    postMessageToNativeApp,
    isWebViewBridgeAvailable,
    NativeAppResponsePayload,
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

export type NavigationBarIcon = {
    /** Content description of the image used for accessibility */
    name: string;
    /** This is a string whose value will be mapped to a local resource that the app already knows. */
    iconEnum?: string;
    /**
     * Set of urls that the app will use to render the icon.
     * If both iconEnum and icon are received, the iconEnum should be used as a fallback in case there's some issue with the urls.
     */
    icon?: {
        /**
         * - Those urls should be icons in PNG format.
         * - The icons will not be rendered until the image has been downloaded by the app.
         * - The URLs should be inmutable to allow the app to cache those icons for an arbitrary amount of time.
         */
        url: string;
        /** To be used if present when dark mode is activated. */
        urlDark?: string;
    };
    badge?: {
        /** Boolean to determine if the badge should be shown. Apps will use true as its default value. */
        show?: boolean;
        /** Same logic and current same supported values as in nativeLogic field from API */
        nativeLogic?: 'INBOX' | 'PROFILE';
        /** Hardcoded value to set as the badge count. It will have more priority than nativeLogic. */
        number?: number;
    };
};

export const updateNavigationBar = ({
    title,
    expandedTitle,
    showBackButton,
    showReloadButton,
    showProfileButton,
    backgroundColor,
}: {
    title?: string;
    expandedTitle?: string;
    showBackButton?: boolean;
    showReloadButton?: boolean;
    /** @deprecated New apps will ignore this field */
    showProfileButton?: boolean;
    backgroundColor?: string;
    leftNavigationIcons?: Array<NavigationBarIcon>;
    rightNavigationIcons?: Array<NavigationBarIcon>;
    /**
     * This is a flag used to indicate that the appearance of the top bar should be restored to its original state.
     * The other fields that may come in the same bridge call will be applied after the reset
     */
    resetToDefaultState?: boolean;
}): Promise<void> => {
    if (isWebViewBridgeAvailable()) {
        return postMessageToNativeApp({
            type: 'NAVIGATION_BAR',
            payload: {
                title,
                expandedTitle,
                showBackButton,
                showReloadButton,
                showProfileButton,
                backgroundColor,
            },
        });
    } else {
        if (typeof title !== 'undefined' && typeof document !== 'undefined') {
            document.title = title;
        }
        return Promise.resolve();
    }
};

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
    if (isWebViewBridgeAvailable()) {
        return postMessageToNativeApp({
            type: 'FETCH',
            payload: {url, method, headers, body},
        }).catch(() => ({
            status: 500,
            headers: {},
            body: 'Bridge call failed',
        }));
    }
    return Promise.resolve({
        status: 500,
        headers: {},
        body: 'Bridge not available',
    });
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
