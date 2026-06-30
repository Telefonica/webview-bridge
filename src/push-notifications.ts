import {postMessageToNativeApp} from './post-message';

/**
 * Tells the native app to start the push notification subscription flow.
 * The native app verifies the notifications permission first; if granted, it
 * starts the corresponding SDK and executes the push subscription.
 *
 * Only available in Mein O2 and Mein Blau.
 *
 * Error cases:
 * - 401: Push notifications permission is not granted
 * - 405: Feature not supported in current brand (only available in Mein Blau and Mein O2)
 * - 500: Any other error that prevented the operation from completing
 */
export const subscribeToPushNotifications = (): Promise<void> =>
    postMessageToNativeApp({type: 'SUBSCRIBE_TO_PUSH_NOTIFICATIONS'});

/**
 * Tells the native app to unsubscribe from pushes through the corresponding SDK.
 * No permission is required.
 *
 * Only available in Mein O2 and Mein Blau.
 *
 * Error cases:
 * - 405: Feature not supported in current brand (only available in Mein Blau and Mein O2)
 * - 500: Any other error that prevented the operation from completing
 */
export const unsubscribeFromPushNotifications = (): Promise<void> =>
    postMessageToNativeApp({type: 'UNSUBSCRIBE_FROM_PUSH_NOTIFICATIONS'});
