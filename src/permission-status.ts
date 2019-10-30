import {postMessageToNativeApp} from './post-message';

const TIMEOUT = 200;

export const hasNotificationsPermissions = (): Promise<boolean> =>
    postMessageToNativeApp(
        {
            type: 'OS_PERMISSION_STATUS',
            payload: {
                feature: 'notifications',
                params: {
                    channelId: 'default',
                },
            },
        },
        TIMEOUT,
    )
        .then(({granted}) => granted)
        .catch(() => false);
