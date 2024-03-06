import {postMessageToNativeApp} from './post-message';

export const getProfileImage = (): Promise<{image: string | null}> =>
    postMessageToNativeApp({
        type: 'GET_PROFILE_IMAGE',
    });

export const startProfileImageFlow = (): Promise<{
    image: string | null;
    isCancelled: boolean;
}> =>
    postMessageToNativeApp({
        type: 'START_PROFILE_IMAGE_FLOW',
    });
