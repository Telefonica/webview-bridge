import {onSessionRenewed, renewSession} from '../sessions';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

afterEach(() => {
    removeFakeAndroidPostMessage();
});

test('webapp requests session renewal to native app', async () => {
    const newAccessToken = 'any token';
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('RENEW_SESSION');
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
            payload: {accessToken: newAccessToken},
        }),
    });

    const accessToken = await renewSession();
    expect(accessToken).toEqual(newAccessToken);
});

test('webapp listens to native app session renewal', done => {
    const newAccessToken = 'any token';

    onSessionRenewed(accessToken => {
        expect(accessToken).toBe(newAccessToken);
        done();
    });

    window.__tuenti_webview_bridge!.postMessage(
        JSON.stringify({
            type: 'SESSION_RENEWED',
            id: 1,
            payload: {accessToken: newAccessToken},
        }),
    );
});
