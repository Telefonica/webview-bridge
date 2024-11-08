import {postMessageToNativeApp} from './post-message';

export const getUnseenNotificationsBadge = async (): Promise<{
    unseenNotificationCounter: number;
    lastUpdated: number;
}> => postMessageToNativeApp({type: 'GET_UNSEEN_NOTIFICATIONS_BADGE'});

export const setUnseenNotificationsBadge = async (payload: {
    unseenNotificationCounter: number;
    lastUpdated: number;
}): Promise<void> =>
    postMessageToNativeApp({type: 'SET_UNSEEN_NOTIFICATIONS_BADGE', payload});
