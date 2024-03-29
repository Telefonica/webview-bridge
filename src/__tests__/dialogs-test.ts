import {nativeAlert, nativeConfirm, nativeMessage} from '../dialogs';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

const ANY_TITLE = 'any-title';
const ANY_MESSAGE = 'any-message';
const ANY_BUTTON_TEXT = 'any-button-text';
const ANY_ACCEPT_TEXT = 'any-accept-text';
const ANY_CANCEL_TEXT = 'any-cancel-text';
const ANY_DURATION = 5000;

afterEach(() => {
    removeFakeAndroidPostMessage();
});

test('native alert', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('ALERT');
            expect(message.payload!).toEqual({
                title: ANY_TITLE,
                message: ANY_MESSAGE,
                buttonText: ANY_BUTTON_TEXT,
            });
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    nativeAlert({
        title: ANY_TITLE,
        message: ANY_MESSAGE,
        buttonText: ANY_BUTTON_TEXT,
    }).then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('native confirm', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('CONFIRM');
            expect(message.payload).toEqual({
                message: ANY_MESSAGE,
                title: ANY_TITLE,
                acceptText: ANY_ACCEPT_TEXT,
                cancelText: ANY_CANCEL_TEXT,
            });
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: {result: true},
        }),
    });

    nativeConfirm({
        title: ANY_TITLE,
        message: ANY_MESSAGE,
        acceptText: ANY_ACCEPT_TEXT,
        cancelText: ANY_CANCEL_TEXT,
    }).then((res) => {
        expect(res).toBe(true);
        done();
    });
});

test('native message', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('MESSAGE');
            expect(message.payload).toEqual({
                message: ANY_MESSAGE,
                duration: ANY_DURATION,
                buttonText: ANY_BUTTON_TEXT,
            });
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: {
                action: 'DISMISS',
            },
        }),
    });

    nativeMessage({
        message: ANY_MESSAGE,
        duration: ANY_DURATION,
        buttonText: ANY_BUTTON_TEXT,
    }).then((res) => {
        expect(res).toEqual({
            action: 'DISMISS',
        });
        done();
    });
});

test('native alert fallbacks to browser alert', (done) => {
    const alert = jest.fn();
    window.alert = alert;

    nativeAlert({
        message: ANY_MESSAGE,
        buttonText: ANY_BUTTON_TEXT,
    }).then((res) => {
        expect(res).toBeUndefined();
        expect(alert.mock.calls.length).toBe(1);
        expect(alert.mock.calls[0][0]).toBe(ANY_MESSAGE);
        done();
    });
});

test('native confirm fallbacks to browser confirm', (done) => {
    const confirm = jest.fn().mockReturnValue(true);

    window.confirm = confirm;

    nativeConfirm({
        message: ANY_MESSAGE,
        acceptText: ANY_ACCEPT_TEXT,
        cancelText: ANY_CANCEL_TEXT,
    }).then((res) => {
        expect(res).toBe(true);
        expect(confirm.mock.calls.length).toBe(1);
        expect(confirm.mock.calls[0][0]).toBe(ANY_MESSAGE);
        done();
    });
});

test('native message fallbacks to browser alert', (done) => {
    const alert = jest.fn();
    window.alert = alert;

    nativeMessage({
        message: ANY_MESSAGE,
    }).then((res) => {
        expect(res).toEqual({action: 'DISMISS'});
        expect(alert.mock.calls.length).toBe(1);
        expect(alert.mock.calls[0][0]).toBe(ANY_MESSAGE);
        done();
    });
});
