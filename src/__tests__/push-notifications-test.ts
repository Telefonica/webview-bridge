import {
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
} from '../push-notifications';
import {createFakeAndroidPostMessage} from './fake-post-message';

test('subscribeToPushNotifications - success', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('SUBSCRIBE_TO_PUSH_NOTIFICATIONS');
            expect(msg.payload).toBeUndefined();
        },
        getResponse: (msg) => ({
            type: 'SUBSCRIBE_TO_PUSH_NOTIFICATIONS',
            id: msg.id,
        }),
    });

    const res = await subscribeToPushNotifications();
    expect(res).toBeUndefined();
});

test('subscribeToPushNotifications - missing permission error', async () => {
    createFakeAndroidPostMessage({
        getResponse: (msg) => ({
            type: 'ERROR',
            id: msg.id,
            payload: {
                code: 401,
                reason: 'Missing Push notifications permission',
            },
        }),
    });

    await expect(subscribeToPushNotifications()).rejects.toEqual({
        code: 401,
        reason: 'Missing Push notifications permission',
    });
});

test('subscribeToPushNotifications - generic error', async () => {
    createFakeAndroidPostMessage({
        getResponse: (msg) => ({
            type: 'ERROR',
            id: msg.id,
            payload: {code: 500, reason: 'Internal error'},
        }),
    });

    await expect(subscribeToPushNotifications()).rejects.toEqual({
        code: 500,
        reason: 'Internal error',
    });
});

test('unsubscribeFromPushNotifications - success', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('UNSUBSCRIBE_FROM_PUSH_NOTIFICATIONS');
            expect(msg.payload).toBeUndefined();
        },
        getResponse: (msg) => ({
            type: 'UNSUBSCRIBE_FROM_PUSH_NOTIFICATIONS',
            id: msg.id,
        }),
    });

    const res = await unsubscribeFromPushNotifications();
    expect(res).toBeUndefined();
});

test('unsubscribeFromPushNotifications - generic error', async () => {
    createFakeAndroidPostMessage({
        getResponse: (msg) => ({
            type: 'ERROR',
            id: msg.id,
            payload: {code: 500, reason: 'Internal error'},
        }),
    });

    await expect(unsubscribeFromPushNotifications()).rejects.toEqual({
        code: 500,
        reason: 'Internal error',
    });
});
