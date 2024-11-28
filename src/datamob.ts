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
}): Promise<{success: boolean}> =>
    postMessageToNativeApp({
        type: 'REGISTER_DATAMOB_USER',
        payload: {phoneNumber, tokenPassword},
    }).then(({success}) => ({success}));

export const validateDatamobRequirements = ({
    phoneNumber,
    tokenPassword,
}: {
    phoneNumber: string;
    tokenPassword: string;
}): Promise<{
    requirements: {
        deviceAdmin: boolean;
        googleAccount: boolean;
        lockPassword: boolean;
        accessibilityOption: boolean;
        invalidPassword: boolean;
        invalidToken: boolean;
    };
}> =>
    postMessageToNativeApp({
        type: 'VALIDATE_DATAMOB_REQUIREMENTS',
        payload: {phoneNumber, tokenPassword},
    }).then(({requirements}) => ({requirements}));
