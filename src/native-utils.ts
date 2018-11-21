import {postMessageToNativeApp} from './post-message';

const TIMEOUT = 200;

export const requestSimIcc = (): Promise<string | null> =>
    postMessageToNativeApp({type: 'SIM_ICC'}, TIMEOUT)
        .then(({icc}) => icc)
        .catch(() => null);

export const requestSimImsi = (): Promise<string | null> =>
    postMessageToNativeApp({type: 'IMSI'}, TIMEOUT)
        .then(({imsi}) => imsi)
        .catch(() => null);

export const requestDeviceImei = (): Promise<string | null> =>
    postMessageToNativeApp({type: 'IMEI'}, TIMEOUT)
        .then(({imei}) => imei)
        .catch(() => null);

export const attachToEmail = ({
    url,
    subject = '',
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

export const setWebViewTitle = (title: string): Promise<void> =>
    postMessageToNativeApp({type: 'SET_TITLE', payload: {title}});
