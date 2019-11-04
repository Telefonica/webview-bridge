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

type RoutesAvalaible = 'notification-settings';

export const internalNavigation = (feature: RoutesAvalaible): Promise<void> =>
    postMessageToNativeApp({
        type: 'INTERNAL_NAVIGATION',
        payload: {
            feature,
        },
    });
