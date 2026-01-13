import {
    requestSimIcc,
    requestSimImsi,
    requestDeviceImei,
    internalNavigation,
    dismiss,
    requestVibration,
    getDiskSpaceInfo,
    getEsimInfo,
    getAttStatus,
    getDeviceModel,
    shareBase64,
    downloadBase64,
    getBatteryInfo,
} from '../../index';
import {
    getAppDomain,
    getBiometricsAuthenticationStatus,
    getInstallationId,
    setBiometricsAuthenticationStatus,
    openOcrScanner,
} from '../device';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
    createFakeWebKitPostMessage,
    removeFakeWebKitPostMessage,
} from './fake-post-message';

const ANY_STRING = 'any-string';
const ANY_ENABLE = true;

afterEach(() => {
    removeFakeAndroidPostMessage();
    removeFakeWebKitPostMessage();
});

test('request sim icc', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('SIM_ICC');
            expect(message.payload).toBeUndefined();
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: {icc: ANY_STRING},
        }),
    });

    requestSimIcc().then((res) => {
        expect(res).toEqual(ANY_STRING);
        done();
    });
});

test('request sim imsi', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('IMSI');
            expect(message.payload).toBeUndefined();
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: {imsi: ANY_STRING},
        }),
    });

    requestSimImsi().then((res) => {
        expect(res).toEqual(ANY_STRING);
        done();
    });
});

test('request device imei', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('IMEI');
            expect(message.payload).toBeUndefined();
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: {imei: ANY_STRING},
        }),
    });

    requestDeviceImei().then((res) => {
        expect(res).toEqual(ANY_STRING);
        done();
    });
});

test('request sim icc (failed)', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('SIM_ICC');
            expect(message.payload).toBeUndefined();
        },
        getResponse: () => ({type: 'other', id: ''}),
    });

    requestSimIcc().then((res) => {
        expect(res).toBeNull();
        done();
    });
});

test('request sim imsi (failed)', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('IMSI');
            expect(message.payload).toBeUndefined();
        },
        getResponse: () => ({type: 'other', id: ''}),
    });

    requestSimImsi().then((res) => {
        expect(res).toBeNull();
        done();
    });
});

test('request device imei (failed)', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('IMEI');
            expect(message.payload).toBeUndefined();
        },
        getResponse: () => ({type: 'other', id: ''}),
    });

    requestDeviceImei().then((res) => {
        expect(res).toBeNull();
        done();
    });
});

test('internal navigation', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('INTERNAL_NAVIGATION');
            expect(msg.payload.feature).toBe('notification-settings');
        },
        getResponse: (msg) => ({
            type: 'INTERNAL_NAVIGATION',
            id: msg.id,
        }),
    });

    internalNavigation('notification-settings').then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('internal navigation to contact settings', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('INTERNAL_NAVIGATION');
            expect(msg.payload.feature).toBe('contact-settings');
        },
        getResponse: (msg) => ({
            type: 'INTERNAL_NAVIGATION',
            id: msg.id,
        }),
    });

    internalNavigation('contact-settings').then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('dismiss', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('DISMISS');
            expect(msg.payload.onCompletionUrl).toBe('http://example.com');
        },
        getResponse: (msg) => ({
            type: 'DISMISS',
            id: msg.id,
        }),
    });

    dismiss('http://example.com').then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('requestVibration', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('VIBRATION');
            expect(msg.payload.type).toBe('success');
        },
        getResponse: (msg) => ({
            type: 'VIBRATION',
            id: msg.id,
        }),
    });

    const res = await requestVibration('success');

    expect(res).toBeUndefined();
});

test('getDiskSpaceInfo', async () => {
    const availableBytes = 50;
    const totalBytes = 50;

    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_DISK_SPACE_INFO');
        },
        getResponse: (msg) => ({
            type: 'GET_DISK_SPACE_INFO',
            id: msg.id,
            payload: {
                availableBytes,
                totalBytes,
            },
        }),
    });

    const res = await getDiskSpaceInfo();

    expect(res).toMatchObject({
        availableBytes,
        totalBytes,
    });
});

test('getEsimInfo', async () => {
    const supportsEsim = true;
    const eid = '123';

    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_ESIM_INFO');
        },
        getResponse: (msg) => ({
            type: 'GET_ESIM_INFO',
            id: msg.id,
            payload: {
                supportsEsim,
                eid,
            },
        }),
    });

    const res = await getEsimInfo();

    expect(res).toMatchObject({
        supportsEsim,
    });
});

test('getAttStatus Success', async () => {
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_ATT_STATUS');
        },
        getResponse: (msg) => ({
            type: 'GET_ATT_STATUS',
            id: msg.id,
            payload: {
                status: 'unknown',
            },
        }),
    });

    const res = await getAttStatus();

    expect(res).toMatchObject({
        status: 'unknown',
    });
});

test('getAttStatus failure', async () => {
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_ATT_STATUS');
        },
        getResponse: (msg) => ({
            type: 'ERROR',
            id: msg.id,
            payload: {
                code: 'foo',
                description: 'bar',
            },
        }),
    });

    const res = await getAttStatus();

    expect(res).toBeNull();
});

test('getDeviceModel Success', async () => {
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('MODEL');
        },
        getResponse: (msg) => ({
            type: 'MODEL',
            id: msg.id,
            payload: {
                model: 'Nokia 3310',
            },
        }),
    });

    const res = await getDeviceModel();

    expect(res).toMatchObject({
        model: 'Nokia 3310',
    });
});

test('getDeviceModel failure', async () => {
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('MODEL');
        },
        getResponse: (msg) => ({
            type: 'ERROR',
            id: msg.id,
            payload: {
                code: 'foo',
                description: 'bar',
            },
        }),
    });

    const res = await getDeviceModel();

    expect(res).toBeNull();
});

test('shareBase64', async () => {
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('SHARE_BASE64');
        },
        getResponse: (msg) => ({
            type: 'SHARE_BASE64',
            id: msg.id,
        }),
    });

    const res = await shareBase64({
        contentInBase64: ANY_STRING,
        fileName: 'example.pdf',
    });

    expect(res).toBe(undefined);
});

test('shareBase64 failure', async () => {
    const error = {
        code: 400,
        description: 'bar',
    };

    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('SHARE_BASE64');
        },
        getResponse: (msg) => ({
            type: 'ERROR',
            id: msg.id,
            payload: error,
        }),
    });

    const res = shareBase64({
        contentInBase64: ANY_STRING,
        fileName: 'example.pdf',
    });

    await expect(res).rejects.toEqual(error);
});

test('downloadBase64', async () => {
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('DOWNLOAD_BASE64');
            expect(msg.payload).toMatchObject({
                content: ANY_STRING,
                fileName: 'example.pdf',
            });
        },
        getResponse: (msg) => ({
            type: 'DOWNLOAD_BASE64',
            id: msg.id,
        }),
    });

    const res = await downloadBase64({
        contentInBase64: ANY_STRING,
        fileName: 'example.pdf',
    });

    expect(res).toBe(undefined);
});

test('downloadBase64 failure', async () => {
    const error = {
        code: 400,
        description: 'bar',
    };

    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('DOWNLOAD_BASE64');
        },
        getResponse: (msg) => ({
            type: 'ERROR',
            id: msg.id,
            payload: error,
        }),
    });

    const res = downloadBase64({
        contentInBase64: ANY_STRING,
        fileName: 'example.pdf',
    });

    await expect(res).rejects.toEqual(error);
});

test('getBatteryInfo', async () => {
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_BATTERY_INFO');
        },
        getResponse: (msg) => ({
            type: 'GET_BATTERY_INFO',
            payload: {
                batteryLevel: 76,
                isPowerSafeMode: false,
            },
            id: msg.id,
        }),
    });

    const res = await getBatteryInfo();

    expect(res).toEqual({
        batteryLevel: 76,
        isPowerSafeMode: false,
    });
});

test('getInstallationId', async () => {
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_INSTALLATION_ID');
        },
        getResponse: (msg) => ({
            type: 'GET_INSTALLATION_ID',
            id: msg.id,
            payload: {
                installationId: '123',
            },
        }),
    });

    const res = await getInstallationId();

    expect(res).toEqual({
        installationId: '123',
    });
});

test('getAppDomain', async () => {
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_APP_DOMAIN');
        },
        getResponse: (msg) => ({
            type: 'GET_APP_DOMAIN',
            id: msg.id,
            payload: {
                domain: 'https://example.com',
            },
        }),
    });

    const res = await getAppDomain();

    expect(res).toEqual({
        domain: 'https://example.com',
    });
});

test('getBiometricsAuthenticationStatus', async () => {
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_BIOMETRICS_AUTHENTICATION_STATUS');
        },
        getResponse: (msg) => ({
            type: 'GET_BIOMETRICS_AUTHENTICATION_STATUS',
            id: msg.id,
            payload: {
                result: 'DISABLED',
            },
        }),
    });

    const res = await getBiometricsAuthenticationStatus();

    expect(res).toEqual({
        result: 'DISABLED',
    });
});

test('getBiometricsAuthenticationStatus Error', async () => {
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_BIOMETRICS_AUTHENTICATION_STATUS');
        },
        getResponse: (msg) => ({
            type: 'ERROR',
            id: msg.id,
            payload: {
                code: 404,
                description: 'Description',
            },
        }),
    });

    await expect(getBiometricsAuthenticationStatus()).rejects.toEqual({
        code: 404,
        description: 'Description',
    });
});

test('setBiometricsAuthenticationStatus happy case', async () => {
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('SET_BIOMETRICS_AUTHENTICATION_STATUS');
            expect(msg.payload).toMatchObject({enable: ANY_ENABLE});
        },
        getResponse: (msg) => ({
            type: 'SET_BIOMETRICS_AUTHENTICATION_STATUS',
            id: msg.id,
            payload: undefined,
        }),
    });

    const res = await setBiometricsAuthenticationStatus({enable: true});
    expect(res).toBeUndefined();
});

test('setBiometricsAuthenticationStatus error', async () => {
    const error = {code: 503, description: 'No biometrics available'};
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('SET_BIOMETRICS_AUTHENTICATION_STATUS');
        },
        getResponse: (msg) => ({
            type: 'ERROR',
            id: msg.id,
            payload: error,
        }),
    });

    const res = setBiometricsAuthenticationStatus({enable: true});
    await expect(res).rejects.toEqual(error);
});

test('openOcrScanner - success with scanned text', async () => {
    const regex = '\\b(?:\\d{4}-\\d{4}-\\d{4}-\\d{4}|\\d{16})\\b';
    const scannedText = '1234-5678-8765-4321';
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('OPEN_OCR_SCANNER');
            expect(msg.payload.regex).toBe(regex);
        },
        getResponse: (msg) => ({
            type: 'OPEN_OCR_SCANNER',
            id: msg.id,
            payload: {scannedText},
        }),
    });

    const res = await openOcrScanner({regex});
    expect(res.scannedText).toBe(scannedText);
});

test('openOcrScanner - missing permissions error (401)', async () => {
    const regex = '\\b(?:\\d{4}-\\d{4}-\\d{4}-\\d{4}|\\d{16})\\b';
    const error = {code: 401, description: 'Missing permissions'};
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('OPEN_OCR_SCANNER');
            expect(msg.payload.regex).toBe(regex);
        },
        getResponse: (msg) => ({
            type: 'ERROR',
            id: msg.id,
            payload: error,
        }),
    });

    const res = openOcrScanner({regex});
    await expect(res).rejects.toEqual(error);
});
