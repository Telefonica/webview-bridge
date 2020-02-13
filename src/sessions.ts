import {postMessageToNativeApp, listenToNativeMessage} from './post-message';

// This method is used by webapp to request the native app to renew current session
// When webapp (running inside a webview) receives a 401 api response from server, uses this
// bridge method to renew the session.
export const renewSession = (): Promise<string> =>
    postMessageToNativeApp({type: 'RENEW_SESSION'}).then(
        ({accessToken}) => accessToken,
    );

// This method is used to listen for session renewals made by native app. Whenever the native app
// renews the session with the api, it should notify webpp with this message.
// This message is initiated by native app.
export const onSessionRenewed = (handler: (newAccessToken: string) => void) =>
    listenToNativeMessage('SESSION_RENEWED', ({accessToken}) =>
        handler(accessToken),
    );
