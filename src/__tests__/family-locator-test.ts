import {
    setupLocatorSdkConfig,
    getLocatorSdkState,
    setLocatorSdkMode,
    getLocatorJwtToken,
    getLocatorPendingPermissions,
    getLocatorSdkVersion,
    getLocatorSdkSession,
    getLocatorSdkMode,
    getLocatorSdkConfig,
    requestPermissionLocation,
    requestPermissionBackgroundLocation,
    requestPermissionMicrophone,
    requestPermissionNotifications,
    requestPermissionCriticalAlerts,
    requestPermissionBatteryOptimization,
} from '../family-locator';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

afterEach(() => {
    removeFakeAndroidPostMessage();
});

test('setupLocatorSdkConfig', async () => {
    const config = {
        license: 'abc',
        sdkVersion: '2.0.1',
        osPlatform: 'android',
        api: {
            token: 'token',
        },
        mqtt: {},
        process: {},
    };
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('SETUP_LOCATOR_SDK_CONFIG');
            expect(msg.payload).toEqual({config});
        },
        getResponse: (msg) => ({
            type: 'SETUP_LOCATOR_SDK_CONFIG',
            id: msg.id,
        }),
    });

    const res = await setupLocatorSdkConfig(config);
    expect(res).toBeUndefined();
});

test('setupLocatorSdkConfig error', async () => {
    const config = {
        license: 'abc',
        sdkVersion: '2.0.1',
        osPlatform: 'android',
        api: {
            token: 'token',
        },
        mqtt: {},
        process: {},
    };
    const error = {
        code: 401,
        reason: 'LocatorSDKMissingPermissionsException',
    };
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('SETUP_LOCATOR_SDK_CONFIG');
            expect(msg.payload).toEqual({config});
        },
        getResponse: (msg) => ({
            type: 'ERROR',
            id: msg.id,
            payload: error,
        }),
    });

    await expect(setupLocatorSdkConfig(config)).rejects.toEqual(error);
});

test('getLocatorSdkState', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_LOCATOR_SDK_STATE');
        },
        getResponse: (msg) => ({
            type: 'GET_LOCATOR_SDK_STATE',
            id: msg.id,
            payload: {state: 'collecting'},
        }),
    });

    const res = await getLocatorSdkState();
    expect(res).toEqual({state: 'collecting'});
});

test('setLocatorSdkMode', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('SET_LOCATOR_SDK_MODE');
            expect(msg.payload).toEqual({mode: 'observed'});
        },
        getResponse: (msg) => ({
            type: 'SET_LOCATOR_SDK_MODE',
            id: msg.id,
        }),
    });

    const res = await setLocatorSdkMode('observed');
    expect(res).toBeUndefined();
});

test('getLocatorJwtToken', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_LOCATOR_JWT_TOKEN');
        },
        getResponse: (msg) => ({
            type: 'GET_LOCATOR_JWT_TOKEN',
            id: msg.id,
            payload: {token: 'jwt-token'},
        }),
    });

    const res = await getLocatorJwtToken();
    expect(res).toEqual({token: 'jwt-token'});
});

test('getLocatorPendingPermissions', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_LOCATOR_PENDING_PERMISSIONS');
        },
        getResponse: (msg) => ({
            type: 'GET_LOCATOR_PENDING_PERMISSIONS',
            id: msg.id,
            payload: {permissions: ['location_in_use', 'location_background']},
        }),
    });

    const res = await getLocatorPendingPermissions();
    expect(res).toEqual({
        permissions: ['location_in_use', 'location_background'],
    });
});

test('getLocatorSdkVersion', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_LOCATOR_SDK_VERSION');
        },
        getResponse: (msg) => ({
            type: 'GET_LOCATOR_SDK_VERSION',
            id: msg.id,
            payload: {version: '2.0.1'},
        }),
    });

    const res = await getLocatorSdkVersion();
    expect(res).toEqual({version: '2.0.1'});
});

test('getLocatorSdkSession', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_LOCATOR_SDK_SESSION');
        },
        getResponse: (msg) => ({
            type: 'GET_LOCATOR_SDK_SESSION',
            id: msg.id,
            payload: {
                session: {
                    id: 'session-id',
                    startAt: 1710087520010,
                    endAt: null,
                },
            },
        }),
    });

    const res = await getLocatorSdkSession();
    expect(res).toEqual({
        session: {
            id: 'session-id',
            startAt: 1710087520010,
            endAt: null,
        },
    });
});

test('getLocatorSdkMode', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_LOCATOR_SDK_MODE');
        },
        getResponse: (msg) => ({
            type: 'GET_LOCATOR_SDK_MODE',
            id: msg.id,
            payload: {mode: 'sos'},
        }),
    });

    const res = await getLocatorSdkMode();
    expect(res).toEqual({mode: 'sos'});
});

test('getLocatorSdkConfig', async () => {
    const config = {
        license: 'abc',
        sdkVersion: '2.0.1',
        osPlatform: 'android',
        api: {
            token: 'token',
        },
        mqtt: {},
        process: {},
    };
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_LOCATOR_SDK_CONFIG');
        },
        getResponse: (msg) => ({
            type: 'GET_LOCATOR_SDK_CONFIG',
            id: msg.id,
            payload: {config},
        }),
    });

    const res = await getLocatorSdkConfig();
    expect(res).toEqual({config});
});

test('requestPermissionLocation', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('REQUEST_PERMISSION_LOCATION');
        },
        getResponse: (msg) => ({
            type: 'REQUEST_PERMISSION_LOCATION',
            id: msg.id,
            payload: {status: 'granted'},
        }),
    });

    const res = await requestPermissionLocation();
    expect(res).toEqual({status: 'granted'});
});

test('requestPermissionBackgroundLocation', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('REQUEST_PERMISSION_BACKGROUND_LOCATION');
        },
        getResponse: (msg) => ({
            type: 'REQUEST_PERMISSION_BACKGROUND_LOCATION',
            id: msg.id,
            payload: {status: 'settings_change_required'},
        }),
    });

    const res = await requestPermissionBackgroundLocation();
    expect(res).toEqual({status: 'settings_change_required'});
});

test('requestPermissionMicrophone', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('REQUEST_PERMISSION_MICROPHONE');
        },
        getResponse: (msg) => ({
            type: 'REQUEST_PERMISSION_MICROPHONE',
            id: msg.id,
            payload: {status: 'denied'},
        }),
    });

    const res = await requestPermissionMicrophone();
    expect(res).toEqual({status: 'denied'});
});

test('requestPermissionNotifications', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('REQUEST_PERMISSION_NOTIFICATIONS');
        },
        getResponse: (msg) => ({
            type: 'REQUEST_PERMISSION_NOTIFICATIONS',
            id: msg.id,
            payload: {status: 'granted'},
        }),
    });

    const res = await requestPermissionNotifications();
    expect(res).toEqual({status: 'granted'});
});

test('requestPermissionCriticalAlerts', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('REQUEST_PERMISSION_CRITICAL_ALERTS');
        },
        getResponse: (msg) => ({
            type: 'REQUEST_PERMISSION_CRITICAL_ALERTS',
            id: msg.id,
            payload: {status: 'denied'},
        }),
    });

    const res = await requestPermissionCriticalAlerts();
    expect(res).toEqual({status: 'denied'});
});

test('requestPermissionBatteryOptimization', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('REQUEST_PERMISSION_BATTERY_OPTIMIZATION');
        },
        getResponse: (msg) => ({
            type: 'REQUEST_PERMISSION_BATTERY_OPTIMIZATION',
            id: msg.id,
            payload: {status: 'settings_change_required'},
        }),
    });

    const res = await requestPermissionBatteryOptimization();
    expect(res).toEqual({status: 'settings_change_required'});
});
