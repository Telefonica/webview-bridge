import {attachToEmail, setWebViewTitle, notifyPageLoaded} from '../utils';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

test('attach to email', async cb => {
    const PARAMS = {
        url: 'any-url',
        subject: 'any-subject',
        fileName: 'file-name',
        recipient: 'recipient',
        body: 'body',
    };

    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('ATTACH_TO_EMAIL');
            expect(message.payload).toEqual(PARAMS);
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
        }),
    });

    attachToEmail(PARAMS).then(res => {
        expect(res).toBeUndefined();
        removeFakeAndroidPostMessage();
        cb();
    });
});

test('set webview title', async cb => {
    const ANY_TITLE = 'any-title';

    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('SET_TITLE');
            expect(message.payload).toEqual({title: ANY_TITLE});
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
        }),
    });

    setWebViewTitle(ANY_TITLE).then(res => {
        expect(res).toBeUndefined();
        removeFakeAndroidPostMessage();
        cb();
    });
});

test('notify page loaded', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('PAGE_LOADED');
            expect(message.payload).toBeUndefined();
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
        }),
    });

    notifyPageLoaded().then(res => {
        expect(res).toBeUndefined();
        removeFakeAndroidPostMessage();
        cb();
    });
});
