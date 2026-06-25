import {postMessageToNativeApp} from './post-message';

/**
 * Tells the native app to start the push notification subscription flow.
 * The native app verifies the notifications permission first; if granted, it
 * starts the corresponding SDK and executes the push subscription.
 *
 * Error cases:
 * - 401: Push notifications permission is not granted
 * - 500: Any other error that prevented the operation from completing
 */
export const subscribeToPushNotifications = (): Promise<void> =>
    postMessageToNativeApp({type: 'SUBSCRIBE_TO_PUSH_NOTIFICATIONS'});

/**
 * Tells the native app to unsubscribe from pushes through the corresponding SDK.
 * No permission is required.
 *
 * Error cases:
 * - 500: Any other error that prevented the operation from completing
 */
export const unsubscribeFromPushNotifications = (): Promise<void> =>
    postMessageToNativeApp({type: 'UNSUBSCRIBE_FROM_PUSH_NOTIFICATIONS'});
