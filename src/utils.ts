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

type ShareOptions =
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
    showProfileButton?: boolean;
    backgroundColor?: string;
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

type RemoteConfig = {result: {[s: string]: string}};

let remoteConfig: null | RemoteConfig = null;

const isRemoteConfigAvailable = (key: string) =>
    (remoteConfig as RemoteConfig).result[key] === 'true';

export const isABTestingAvailable = (key: string): Promise<boolean> => {
    if (!remoteConfig) {
        // If GET_REMOTE_CONFIG takes more than 5s to respond, resolve to false
        const timeoutP = new Promise<boolean>((resolve) => {
            setTimeout(() => {
                resolve(false);
            }, 500);
        });

        const configP = postMessageToNativeApp({
            type: 'GET_REMOTE_CONFIG',
        }).then((res) => {
            remoteConfig = res;
            return isRemoteConfigAvailable(key);
        });

        return Promise.race([timeoutP, configP]);
    } else {
        return Promise.resolve(isRemoteConfigAvailable(key));
    }
};

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

type PermissionsStatus = 'notifications';

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
