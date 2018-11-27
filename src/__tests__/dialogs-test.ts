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

test('native alert', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('ALERT');
            expect(message.payload!).toEqual({
                title: ANY_TITLE,
                message: ANY_MESSAGE,
                buttonText: ANY_BUTTON_TEXT,
            });
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
        }),
    });

    nativeAlert({
        title: ANY_TITLE,
        message: ANY_MESSAGE,
        buttonText: ANY_BUTTON_TEXT,
    }).then(res => {
        expect(res).toBeUndefined();
        removeFakeAndroidPostMessage();
        cb();
    });
});

test('native confirm', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('CONFIRM');
            expect(message.payload).toEqual({
                message: ANY_MESSAGE,
                title: ANY_TITLE,
                acceptText: ANY_ACCEPT_TEXT,
                cancelText: ANY_CANCEL_TEXT,
            });
        },
        getResponse: message => ({
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
    }).then(res => {
        expect(res).toBe(true);
        removeFakeAndroidPostMessage();
        cb();
    });
});

test('native message', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('MESSAGE');
            expect(message.payload).toEqual({
                message: ANY_MESSAGE,
                duration: ANY_DURATION,
                buttonText: ANY_BUTTON_TEXT,
            });
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
        }),
    });

    nativeMessage({
        message: ANY_MESSAGE,
        duration: ANY_DURATION,
        buttonText: ANY_BUTTON_TEXT,
    }).then(res => {
        expect(res).toBeUndefined();
        removeFakeAndroidPostMessage();
        cb();
    });
});
