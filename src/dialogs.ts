import {postMessageToNativeApp, isWebViewBridgeAvailable} from './post-message';

export const nativeConfirm = ({
    message,
    title,
    acceptText,
    cancelText,
}: {
    message: string;
    title?: string;
    acceptText: string;
    cancelText: string;
}): Promise<boolean> => {
    if (isWebViewBridgeAvailable()) {
        return postMessageToNativeApp({
            type: 'CONFIRM',
            payload: {message, title, acceptText, cancelText},
        }).then(({result}) => result);
    } else {
        return Promise.resolve(
            typeof window === 'undefined' ? false : window.confirm(message),
        );
    }
};

export const nativeAlert = ({
    message,
    title,
    buttonText,
}: {
    message: string;
    title?: string;
    buttonText: string;
}): Promise<void> => {
    if (isWebViewBridgeAvailable()) {
        return postMessageToNativeApp({
            type: 'ALERT',
            payload: {title, message, buttonText},
        });
    } else {
        if (typeof window !== 'undefined') {
            window.alert(message);
        }
        return Promise.resolve();
    }
};

export const nativeMessage = ({
    message,
    duration,
    buttonText,
    type,
}: {
    message: string;
    duration?: number; // milliseconds
    buttonText?: string;
    type?: 'INFORMATIVE' | 'CRITICAL' | 'SUCCESS';
}): Promise<void> => {
    if (isWebViewBridgeAvailable()) {
        return postMessageToNativeApp({
            type: 'MESSAGE',
            payload: {message, duration, buttonText, type},
        });
    } else {
        if (typeof window !== 'undefined') {
            window.alert(message);
        }
        return Promise.resolve();
    }
};
