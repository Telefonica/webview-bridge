import {
    requestSimIcc,
    requestSimImsi,
    requestDeviceImei,
    internalNavigation,
    dismiss,
    requestVibration,
    getDiskSpaceInfo,
} from '../device';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

const ANY_STRING = 'any-string';

afterEach(() => {
    removeFakeAndroidPostMessage();
});

test('request sim icc', async (cb) => {
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
        cb();
    });
});

test('request sim imsi', async (cb) => {
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
        cb();
    });
});

test('request device imei', async (cb) => {
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
        cb();
    });
});

test('request sim icc (failed)', async (cb) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('SIM_ICC');
            expect(message.payload).toBeUndefined();
        },
        getResponse: () => ({type: 'other', id: ''}),
    });

    requestSimIcc().then((res) => {
        expect(res).toBeNull();
        cb();
    });
});

test('request sim imsi (failed)', async (cb) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('IMSI');
            expect(message.payload).toBeUndefined();
        },
        getResponse: () => ({type: 'other', id: ''}),
    });

    requestSimImsi().then((res) => {
        expect(res).toBeNull();
        cb();
    });
});

test('request device imei (failed)', async (cb) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('IMEI');
            expect(message.payload).toBeUndefined();
        },
        getResponse: () => ({type: 'other', id: ''}),
    });

    requestDeviceImei().then((res) => {
        expect(res).toBeNull();
        cb();
    });
});

test('internal navigation', async (cb) => {
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
        cb();
    });
});

test('dismiss', async (cb) => {
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
        cb();
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
