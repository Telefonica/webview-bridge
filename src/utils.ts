import {postMessageToNativeApp, isWebViewBridgeAvailable} from './post-message';

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

/**
 * @deprecated
 */
export const setWebViewTitle = (title: string): Promise<void> => {
    if (isWebViewBridgeAvailable()) {
        return postMessageToNativeApp({type: 'SET_TITLE', payload: {title}});
    } else {
        document.title = title;
        return Promise.resolve();
    }
};

export const updateNavigationBar = ({
    title,
    showBackButton,
    showReloadButton,
    backgroundColor,
}: {
    title?: string;
    showBackButton?: boolean;
    showReloadButton?: boolean;
    backgroundColor?: string;
}): Promise<void> => {
    if (isWebViewBridgeAvailable()) {
        return postMessageToNativeApp({
            type: 'NAVIGATION_BAR',
            payload: {
                title,
                showBackButton,
                showReloadButton,
                backgroundColor,
            },
        });
    } else {
        if (typeof title !== 'undefined') {
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
        return postMessageToNativeApp({type: 'GET_REMOTE_CONFIG'}).then(res => {
            remoteConfig = res;
            return isRemoteConfigAvailable(key);
        });
    } else {
        return Promise.resolve(isRemoteConfigAvailable(key));
    }
};

export const reportStatus = ({
    feature,
    status,
    reason,
}: {
    feature: string;
    status: 'CRITICAL' | 'GOOD' | 'BAD';
    reason: string;
}) =>
    postMessageToNativeApp({
        type: 'STATUS_REPORT',
        payload: {status, reason, feature},
    });
