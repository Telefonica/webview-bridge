import {postMessageToNativeApp} from './post-message';

const TIMEOUT = 200;

/** @deprecated */
export const requestSimIcc = (): Promise<string | null> =>
    postMessageToNativeApp({type: 'SIM_ICC'}, TIMEOUT)
        .then((response) => response.icc)
        .catch(() => null);

/** @deprecated */
export const requestSimImsi = (): Promise<string | null> =>
    postMessageToNativeApp({type: 'IMSI'}, TIMEOUT)
        .then((response) => response.imsi)
        .catch(() => null);

export const requestDeviceImei = (): Promise<string | null> =>
    postMessageToNativeApp({type: 'IMEI'}, TIMEOUT)
        .then((response) => response.imei)
        .catch(() => null);

type RoutesAvalaible =
    | 'notification-settings'
    | 'contact-settings'
    | 'location-settings'
    | 'permissions-settings'
    | 'accessibility-settings';

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

export const shareBase64 = (params: {
    contentInBase64: string;
    fileName: string;
}): Promise<void> =>
    postMessageToNativeApp({
        type: 'SHARE_BASE64',
        payload: {
            content: params.contentInBase64,
            fileName: params.fileName,
        },
    });

export const downloadBase64 = (params: {
    contentInBase64: string;
    fileName: string;
}): Promise<void> =>
    postMessageToNativeApp({
        type: 'DOWNLOAD_BASE64',
        payload: {
            content: params.contentInBase64,
            fileName: params.fileName,
        },
    });

export const getBatteryInfo = (): Promise<{
    batteryLevel: number | null;
    isPowerSafeMode: boolean;
}> => postMessageToNativeApp({type: 'GET_BATTERY_INFO'});

export const getInstallationId = (): Promise<{installationId: string}> =>
    postMessageToNativeApp({type: 'GET_INSTALLATION_ID'});

export const getAppDomain = (): Promise<{domain: string}> =>
    postMessageToNativeApp({type: 'GET_APP_DOMAIN'});

/**
 * Get the current status of the biometrics authentication on the device.
 *
 * Possible results:
 * - 'DISABLED': The device has an authentication method (device PIN code at least, and biometrics optionally) but it has the biometrics option disabled in the app
 * - 'ENABLED': The device has an authentication method (device PIN code at least, and biometrics optionally) and it has the biometrics option enabled in the app (it requires authentication when launching the app)
 * - 'DEVICE_HAS_NO_AUTHENTICATION': The device has not any authentication method (it has no device PIN code neither biometrics)
 *
 * Error cases:
 * - 404: The bridge implementation does not support this feature
 * - 500: User is not logged in
 */
export const getBiometricsAuthenticationStatus = (): Promise<{
    result: 'DISABLED' | 'ENABLED' | 'DEVICE_HAS_NO_AUTHENTICATION';
}> => {
    return postMessageToNativeApp({
        type: 'GET_BIOMETRICS_AUTHENTICATION_STATUS',
    });
};

/**
 * Set the current status of the biometrics authentication on the device.
 *
 * Possible request based on 'enable':
 * - false: Disable biometrics in the app and remove any related information
 * - true: Trigger the biometrics enabling native UI
 *
 * Error cases:
 * - 400: enable parameter is missing
 * - 500: Native side error while applying the setting
 * - 503: The device has no biometrics available, or the user cancelled modifying biometric settings.
 */
export const setBiometricsAuthenticationStatus = (params: {
    enable: boolean;
}): Promise<void> =>
    postMessageToNativeApp({
        type: 'SET_BIOMETRICS_AUTHENTICATION_STATUS',
        payload: {
            enable: params.enable,
        },
    });

/**
 * Opens a native OCR scanner that looks for text matching the provided regular expression.
 * When a text is found matching the pattern, the scanner closes and returns the scanned text.
 * Only the first text that matches the pattern will be returned.
 *
 * The scanner will attempt to request camera permissions automatically.
 * Only available in Mein Blau and Mein O2.
 *
 * Error cases:
 * - 401: Missing permissions (user rejected camera permissions)
 * - 405: Feature not supported in current brand (only available in Mein Blau and Mein O2)
 * - 500: Internal error (e.g., unexpected error thrown by native scanner)
 *
 * @param params.regex - Regular expression pattern to match the scanned text
 * @returns Promise that resolves to an object containing the scanned text or null if user closed the scanner
 */
export const openOcrScanner = (params: {
    regex: string;
}): Promise<{scannedText: string | null}> =>
    postMessageToNativeApp({
        type: 'OPEN_OCR_SCANNER',
        payload: {
            regex: params.regex,
        },
    });
