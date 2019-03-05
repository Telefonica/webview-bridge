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
