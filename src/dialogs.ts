import {postMessageToNativeApp} from './post-message';

export const nativeConfirm = ({
    message,
    title = '',
    acceptText,
    cancelText,
}: {
    message: string;
    title?: string;
    acceptText?: string;
    cancelText?: string;
}): Promise<boolean> =>
    postMessageToNativeApp({
        type: 'CONFIRM',
        payload: {message, title, acceptText, cancelText},
    }).then(({result}) => result);

export const nativeAlert = ({
    message,
    title = '',
    buttonText,
}: {
    message: string;
    title?: string;
    buttonText?: string;
}): Promise<void> =>
    postMessageToNativeApp({
        type: 'ALERT',
        payload: {title, message, buttonText},
    });

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
}): Promise<void> =>
    postMessageToNativeApp({
        type: 'MESSAGE',
        payload: {message, duration, buttonText, type},
    });
