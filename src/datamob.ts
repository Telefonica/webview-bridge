import {postMessageToNativeApp} from './post-message';

export const requestDatamobDeviceAdmin = (): Promise<{isAdmin: boolean}> =>
    postMessageToNativeApp({
        type: 'REQUEST_DATAMOB_DEVICE_ADMIN',
        payload: {},
    }).then(({isAdmin}) => ({isAdmin}));

export const registerDatamobUser = ({
    phoneNumber,
    tokenPassword,
}: {
    phoneNumber: string;
    tokenPassword: string;
}): Promise<void> =>
    postMessageToNativeApp({
        type: 'REGISTER_DATAMOB_USER',
        payload: {phoneNumber, tokenPassword},
    });

export const validateDatamobRequirements = ({
    phoneNumber,
    tokenPassword,
}: {
    phoneNumber: string;
    tokenPassword: string;
}): Promise<{
    deviceAdmin: boolean;
    lockPassword: boolean;
    accessibilityOption: boolean;
    invalidPhoneNumber: boolean;
    invalidToken: boolean;
}> =>
    postMessageToNativeApp({
        type: 'VALIDATE_DATAMOB_REQUIREMENTS',
        payload: {phoneNumber, tokenPassword},
    });

export const unregisterDatamobDeviceAdmin = (): Promise<void> =>
    postMessageToNativeApp({type: 'UNREGISTER_DATAMOB_DEVICE_ADMIN'});
