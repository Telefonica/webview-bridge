export {
    isWebViewBridgeAvailable,
    onNativeEvent,
    NativeEventHandler,
    setLogger,
} from './src/post-message';

export {nativeConfirm, nativeAlert, nativeMessage} from './src/dialogs';

export {
    /** @deprecated */
    requestSimIcc,
    /** @deprecated */
    requestSimImsi,
    requestDeviceImei,
    internalNavigation,
    dismiss,
    requestVibration,
    getDiskSpaceInfo,
    getEsimInfo,
    getAttStatus,
    getDeviceModel,
    getDeviceTac,
    shareBase64,
    downloadBase64,
    getBatteryInfo,
    getInstallationId,
    getBiometricsAuthenticationStatus,
    setBiometricsAuthenticationStatus,
    openOcrScanner,
} from './src/device';

export {
    attachToEmail,
    share,
    setWebViewTitle,
    updateNavigationBar,
    notifyPageLoaded,
    notifyBridgeReady,
    getRemoteConfig,
    isABTestingAvailable,
    reportStatus,
    fetch,
    checkPermissionStatus,
    getAppMetadata,
    getNetworkConnectionInfo,
    setActionBehavior,
    getTopazToken,
    getTopazValues,
    getPincodeInfo,
    onNavigationBarIconClicked,
    triggerPinOrBiometricAuthentication,
    focusNavbar,
    showLoadingOverlay,
    hideLoadingOverlay,
} from './src/utils';
export type {ShareOptions, NavigationBarIcon} from './src/utils';

export {createCalendarEvent} from './src/calendar';

export {
    requestContact,
    fetchContactsByPhone,
    fetchPhoneNumbers,
    updatePhoneNumbers,
    addOrEditContact,
} from './src/contacts';

export {highlightNavigationTab, refreshNavBar} from './src/navigation-tabs';

export {
    logEvent,
    logEcommerceEvent,
    logTiming,
    setScreenName,
    setUserProperty,
    CD_WEBAPP_INSTALLED,
    CD_NOVUM_UID,
    CD_EVENT_VALUE,
    setTrackingProperty,
    sanitizeAnalyticsParam,
    sanitizeAnalyticsParams,
} from './src/analytics';
export type {TrackingEvent, CustomDimensionIdx} from './src/analytics';

export {renewSession, onSessionRenewed, logout} from './src/sessions';

export {
    showAppRating,
    increaseAppRatingTrigger,
    resetAppRatingTrigger,
    appRatingRemindMeLater,
} from './src/app-rating';

export {
    bottomSheet,
    // @deprecated - use Mistica implementation
    bottomSheetSingleSelector,
    // @deprecated - use Mistica implementation
    bottomSheetActionSelector,
    // @deprecated - use Mistica implementation
    bottomSheetInfo,
} from './src/bottom-sheet';
export type {
    SheetRowItem,
    SheetActionItem,
    SheetInfoItem,
} from './src/bottom-sheet';

export {openOnboarding} from './src/open-onboarding';

export {
    getProfileImage,
    startProfileImageFlow,
    showLineSelector,
} from './src/profile';
export {readTextFromClipboard, writeTextToClipboard} from './src/clipboard';
export {
    getUnseenNotificationsBadge,
    setUnseenNotificationsBadge,
} from './src/inbox-notifications';

export {
    registerDatamobUser,
    requestDatamobDeviceAdmin,
    validateDatamobRequirements,
    unregisterDatamobDeviceAdmin,
} from './src/datamob';

export {
    displayQualtricsIntercept,
    setQualtricsProperties,
    isQualtricsInterceptAvailableForUser,
} from './src/qualtrics';

export {
    type AllowMeErrorCode,
    type AllowMeError,
    AllowMeGenericError,
    AllowMeUnauthorizedError,
    AllowMeSetupSdkError,
    AllowMeTimeoutProcessingError,
    AllowMeApiKeyError,
    AllowMeInstanceCreationError,
    AllowMeBiometricsTimeoutError,
    AllowMeBiometricsSetupError,
    AllowMeBiometricsCameraError,
    AllowMeBiometricsCapturingError,
    AllowMeBiometricsResultError,
    AllowMeBiometricsCancelledByUserError,
    AllowMeBiometricsInvalidImagesError,
    AllowMeBiometricsCameraPermissionError,
    AllowMeCanNotOpenFrontCameraError,
    AllowMeGooglePayServicesError,
    AllowMeFaceDetectionError,
    AllowMeProviderError,
    AllowMeCanNotSaveImageError,
    requestAllowMeBiometrics,
} from './src/allow-me';
