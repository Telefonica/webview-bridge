import {requestSimIcc, requestSimImsi, requestDeviceImei} from '../device';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

const ANY_STRING = 'any-string';

test('request sim icc', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('SIM_ICC');
            expect(message.payload).toBeUndefined();
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
            payload: {icc: ANY_STRING},
        }),
    });

    requestSimIcc().then(res => {
        expect(res).toEqual(ANY_STRING);
        removeFakeAndroidPostMessage();
        cb();
    });
});

test('request sim imsi', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('IMSI');
            expect(message.payload).toBeUndefined();
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
            payload: {imsi: ANY_STRING},
        }),
    });

    requestSimImsi().then(res => {
        expect(res).toEqual(ANY_STRING);
        removeFakeAndroidPostMessage();
        cb();
    });
});

test('request device imei', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('IMEI');
            expect(message.payload).toBeUndefined();
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
            payload: {imei: ANY_STRING},
        }),
    });

    requestDeviceImei().then(res => {
        expect(res).toEqual(ANY_STRING);
        removeFakeAndroidPostMessage();
        cb();
    });
});

test('request sim icc (failed)', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('SIM_ICC');
            expect(message.payload).toBeUndefined();
        },
        getResponse: () => ({type: 'other', id: ''}),
    });

    requestSimIcc().then(res => {
        expect(res).toBeNull();
        removeFakeAndroidPostMessage();
        cb();
    });
});

test('request sim imsi (failed)', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('IMSI');
            expect(message.payload).toBeUndefined();
        },
        getResponse: () => ({type: 'other', id: ''}),
    });

    requestSimImsi().then(res => {
        expect(res).toBeNull();
        removeFakeAndroidPostMessage();
        cb();
    });
});

test('request device imei (failed)', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('IMEI');
            expect(message.payload).toBeUndefined();
        },
        getResponse: () => ({type: 'other', id: ''}),
    });

    requestDeviceImei().then(res => {
        expect(res).toBeNull();
        removeFakeAndroidPostMessage();
        cb();
    });
});
