import {
    postMessageToNativeApp,
    isWebViewBridgeAvailable,
    type SnackbarResponse,
} from './post-message';

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
    withDismiss,
}: {
    message: string;
    /**
     * By default, the snackbar auto dismisses after 5s or 10s (if it has buttonText)
     * PERSISTENT: the snackbar won't dismiss without user interaction
     * FIVE_SECONDS: the snackbar will dismiss after 5 seconds
     * TEN_SECONDS: the snackbar will dismiss after 10 seconds
     * number: deprecated, this is ignored by native app
     */
    duration?: 'PERSISTENT' | 'FIVE_SECONDS' | 'TEN_SECONDS' | number;
    buttonText?: string;
    type?: 'INFORMATIVE' | 'CRITICAL' | 'SUCCESS';
    /**
     * When true, the snackbar will have a dismiss button. By default is false.
     * If the snackbar has duration: "PERSISTENT" and doesn't have buttonText, the
     * dismiss button is always shown, regardless of this attribute value.
     */
    withDismiss?: boolean;
}): Promise<SnackbarResponse> => {
    if (isWebViewBridgeAvailable()) {
        return postMessageToNativeApp({
            type: 'MESSAGE',
            payload: {message, duration, buttonText, type, withDismiss},
        }).then((response) => {
            // old app versions didn't return a response or returned a response without action
            if (!response || !response.action) {
                return {
                    action: 'DISMISS',
                };
            }

            return response;
        });
    } else {
        if (typeof window !== 'undefined') {
            window.alert(message);
        }
        return Promise.resolve({action: 'DISMISS'});
    }
};
