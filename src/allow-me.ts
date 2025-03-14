import {postMessageToNativeApp} from './post-message';

export const AllowMeGenericError = 500;
export const AllowMeUnauthorizedError = 401;
export const AllowMeSetupSdkError = 1001;
export const AllowMeTimeoutProcessingError = 1002;
export const AllowMeApiKeyError = 1003;
export const AllowMeInstanceCreationError = 1004;
export const AllowMeBiometricsTimeoutError = 1005;
export const AllowMeBiometricsSetupError = 1006;
export const AllowMeBiometricsCameraError = 1007;
export const AllowMeBiometricsCapturingError = 1008;
export const AllowMeBiometricsResultError = 1009;
export const AllowMeBiometricsCancelledByUserError = 1010;
export const AllowMeBiometricsInvalidImagesError = 1011;
export const AllowMeBiometricsCameraPermissionError = 1012;
export const AllowMeCanNotOpenFrontCameraError = 1013;
export const AllowMeGooglePayServicesError = 1014;
export const AllowMeFaceDetectionError = 1015;
export const AllowMeProviderError = 1016;
export const AllowMeCanNotSaveImageError = 1017;

export type AllowMeErrorCode =
    | typeof AllowMeGenericError
    | typeof AllowMeUnauthorizedError
    | typeof AllowMeSetupSdkError
    | typeof AllowMeTimeoutProcessingError
    | typeof AllowMeApiKeyError
    | typeof AllowMeInstanceCreationError
    | typeof AllowMeBiometricsTimeoutError
    | typeof AllowMeBiometricsSetupError
    | typeof AllowMeBiometricsCameraError
    | typeof AllowMeBiometricsCapturingError
    | typeof AllowMeBiometricsResultError
    | typeof AllowMeBiometricsCancelledByUserError
    | typeof AllowMeBiometricsInvalidImagesError
    | typeof AllowMeBiometricsCameraPermissionError
    | typeof AllowMeCanNotOpenFrontCameraError
    | typeof AllowMeGooglePayServicesError
    | typeof AllowMeFaceDetectionError
    | typeof AllowMeProviderError
    | typeof AllowMeCanNotSaveImageError;

export type AllowMeError = {
    code: AllowMeErrorCode;
    description?: string;
};

export const requestAllowMeBiometrics = (): Promise<{result: string}> =>
    postMessageToNativeApp({type: 'REQUEST_ALLOWME_BIOMETRICS'});
