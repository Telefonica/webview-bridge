import {postMessageToNativeApp} from './post-message';

// Family Locator SDK webview bridge methods.
// https://telefonicacorp.sharepoint.com/:w:/r/sites/Colabora_TCX/_layouts/15/Doc.aspx?sourcedoc=%7BD524FA49-9937-4D20-958A-7055D67B65DB%7D&file=Shared%20Spec%20%25u2013%20OBVIVO-3177%20-%20Family%20locator.docx&nav=eyJjIjoxMjA3NDU5NjUzfQ&action=default&mobileredirect=true

export type LocatorSdkMode = 'default' | 'observed' | 'sos';
export type LocatorSdkConfig = Record<string, unknown>;

export const setupLocatorSdkConfig = (
    config: LocatorSdkConfig,
): Promise<void> =>
    postMessageToNativeApp({
        type: 'SETUP_LOCATOR_SDK_CONFIG',
        payload: {
            config,
        },
    });

export const getLocatorSdkState = (): Promise<{state: string}> =>
    postMessageToNativeApp({type: 'GET_LOCATOR_SDK_STATE'});

export const setLocatorSdkMode = (mode: LocatorSdkMode): Promise<void> =>
    postMessageToNativeApp({
        type: 'SET_LOCATOR_SDK_MODE',
        payload: {
            mode,
        },
    });

export const getLocatorJwtToken = (): Promise<{token: string}> =>
    postMessageToNativeApp({type: 'GET_LOCATOR_JWT_TOKEN'});

export const getLocatorPendingPermissions = (): Promise<{
    permissions: Array<string>;
}> => postMessageToNativeApp({type: 'GET_LOCATOR_PENDING_PERMISSIONS'});

export const getLocatorSdkVersion = (): Promise<{version: string}> =>
    postMessageToNativeApp({type: 'GET_LOCATOR_SDK_VERSION'});

export const getLocatorSdkSession = (): Promise<{
    session: {
        id: string;
        startAt: number;
        endAt: number | null;
    };
}> => postMessageToNativeApp({type: 'GET_LOCATOR_SDK_SESSION'});

export const getLocatorSdkMode = (): Promise<{
    mode: LocatorSdkMode;
}> => postMessageToNativeApp({type: 'GET_LOCATOR_SDK_MODE'});

export const getLocatorSdkConfig = (): Promise<{
    config: LocatorSdkConfig | null;
}> => postMessageToNativeApp({type: 'GET_LOCATOR_SDK_CONFIG'});
