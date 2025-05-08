import {postMessageToNativeApp} from './post-message';

/**
 * This method is used by webapp to request the native app to launch the app rating dialog
 */
export const showAppRating = (): Promise<void> =>
    postMessageToNativeApp({type: 'SHOW_APP_RATING'});

export const increaseAppRatingTrigger = (key: string): Promise<void> =>
    postMessageToNativeApp({
        type: 'INCREASE_APP_RATING_TRIGGER',
        payload: {key},
    });

export const resetAppRatingTrigger = (key: string): Promise<void> =>
    postMessageToNativeApp({type: 'RESET_APP_RATING_TRIGGER', payload: {key}});

export const appRatingRemindMeLater = (): Promise<void> =>
    postMessageToNativeApp({type: 'APP_RATING_REMIND_ME_LATER'});
