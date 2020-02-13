import {postMessageToNativeApp, listenToNativeMessage} from './post-message';

export const renewSession = () =>
    postMessageToNativeApp({type: 'RENEW_SESSION'}).then(
        ({accessToken}) => accessToken,
    );

export const onSessionRenewed = (handler: (newAccessToken: string) => void) =>
    listenToNativeMessage('SESSION_RENEWED', ({accessToken}) =>
        handler(accessToken),
    );
