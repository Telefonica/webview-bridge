import {postMessageToNativeApp} from './post-message';

/**
 * This method is used by webapp to request the native app to launch the app rating dialog
 */
export const showAppRating = (): Promise<void> =>
    postMessageToNativeApp({type: 'SHOW_APP_RATING'});

