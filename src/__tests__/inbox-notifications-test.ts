import {
    getUnseenNotificationsBadge,
    setUnseenNotificationsBadge,
} from '../inbox-notifications';
import {createFakeWebKitPostMessage} from './fake-post-message';

test('getUnseenNotificationsBadge', async () => {
    const anyTimestamp = new Date().getTime();
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_UNSEEN_NOTIFICATIONS_BADGE');
        },
        getResponse: (msg) => ({
            type: 'GET_UNSEEN_NOTIFICATIONS_BADGE',
            id: msg.id,
            payload: {
                unseenNotificationCounter: 2,
                lastUpdated: anyTimestamp,
            },
        }),
    });

    const res = await getUnseenNotificationsBadge();

    expect(res).toEqual({
        unseenNotificationCounter: 2,
        lastUpdated: anyTimestamp,
    });
});

test('setUnseenNotificationsBadge', async () => {
    const anyTimestamp = new Date().getTime();
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('SET_UNSEEN_NOTIFICATIONS_BADGE');
            expect(msg.payload).toEqual({
                unseenNotificationCounter: 3,
                lastUpdated: anyTimestamp,
            });
        },
        getResponse: (msg) => ({
            type: 'SET_UNSEEN_NOTIFICATIONS_BADGE',
            id: msg.id,
        }),
    });

    await setUnseenNotificationsBadge({
        unseenNotificationCounter: 3,
        lastUpdated: anyTimestamp,
    });
});
