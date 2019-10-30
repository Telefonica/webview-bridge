import {hasNotificationsPermissions} from '../permission-status';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

test('app has notifications permissions', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: msg => {
            expect(msg.type).toBe('OS_PERMISSION_STATUS');
            expect(msg.payload.feature).toBe('notifications');
            expect(msg.payload.params.channelId).toBe('default');
        },
        getResponse: msg => ({
            type: 'OS_PERMISSION_STATUS',
            id: msg.id,
            payload: {granted: true},
        }),
    });

    hasNotificationsPermissions().then(res => {
        expect(res).toBe(true);
        removeFakeAndroidPostMessage();
        cb();
    });
});

test('app has not notifications permissions', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: msg => {
            expect(msg.type).toBe('OS_PERMISSION_STATUS');
            expect(msg.payload.feature).toBe('notifications');
            expect(msg.payload.params.channelId).toBe('default');
        },
        getResponse: msg => ({
            type: 'OS_PERMISSION_STATUS',
            id: msg.id,
            payload: {granted: false},
        }),
    });

    hasNotificationsPermissions().then(res => {
        expect(res).toBe(false);
        removeFakeAndroidPostMessage();
        cb();
    });
});
