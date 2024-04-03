import {postMessageToNativeApp} from './post-message';

const TIMEOUT = 200;

/** @deprecated */
export const requestSimIcc = (): Promise<string | null> =>
    postMessageToNativeApp({type: 'SIM_ICC'}, TIMEOUT)
        .then(({icc}) => icc)
        .catch(() => null);

/** @deprecated */
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
    eid?: string | null;
}> =>
    postMessageToNativeApp({
        type: 'GET_ESIM_INFO',
    }).catch(() => ({
        supportsEsim: false,
        eid: null,
    }));

export const getAttStatus = (): Promise<{
    status: 'granted' | 'denied' | 'unknown';
} | null> =>
    postMessageToNativeApp({
        type: 'GET_ATT_STATUS',
    }).catch(() => null);

export const getDeviceModel = (): Promise<{model: string} | null> =>
    postMessageToNativeApp({
        type: 'MODEL',
    }).catch(() => null);

export const getDeviceTac = (): Promise<{tac: string | null}> =>
    postMessageToNativeApp({
        type: 'TAC',
    }).catch(() => ({tac: null}));
