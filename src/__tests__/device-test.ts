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
} from '../device';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

const ANY_STRING = 'any-string';

afterEach(() => {
    removeFakeAndroidPostMessage();
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
        removeFakeAndroidPostMessage();
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
        removeFakeAndroidPostMessage();
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
        removeFakeAndroidPostMessage();
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
    removeFakeAndroidPostMessage();
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
    removeFakeAndroidPostMessage();
});

test('getEsimInfo', async () => {
    const supportsEsim = true;

    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_ESIM_INFO');
        },
        getResponse: (msg) => ({
            type: 'GET_ESIM_INFO',
            id: msg.id,
            payload: {
                supportsEsim,
            },
        }),
    });

    const res = await getEsimInfo();

    expect(res).toMatchObject({
        supportsEsim,
    });
    removeFakeAndroidPostMessage();
});

test('getAttStatus Success', async () => {
    createFakeAndroidPostMessage({
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
    removeFakeAndroidPostMessage();
});

test('getAttStatus failure', async () => {
    createFakeAndroidPostMessage({
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
    removeFakeAndroidPostMessage();
});
