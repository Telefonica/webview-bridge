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

type RoutesAvalaible = 'notification-settings' | 'contact-settings';

export const internalNavigation = (feature: RoutesAvalaible): Promise<void> =>
    postMessageToNativeApp({
        type: 'INTERNAL_NAVIGATION',
        payload: {
            feature,
        },
    });

export const dismiss = (onCompletionUrl?: string): Promise<void> =>
    postMessageToNativeApp({
        type: 'DISMISS',
        payload: {
            onCompletionUrl,
        },
    });

export const requestVibration = (type: 'error' | 'success'): Promise<void> =>
    postMessageToNativeApp({
        type: 'VIBRATION',
        payload: {
            type,
        },
    });

export const getDiskSpaceInfo = (): Promise<{
    availableBytes: number;
    totalBytes: number;
}> =>
    postMessageToNativeApp({
        type: 'GET_DISK_SPACE_INFO',
    });

export const getEsimInfo = (): Promise<{
    supportsEsim: boolean;
}> =>
    postMessageToNativeApp({
        type: 'GET_ESIM_INFO',
    }).catch(() => ({
        supportsEsim: false,
    }));
