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
} from './src/utils';
export type {ShareOptions, NavigationBarIcon} from './src/utils';

export {createCalendarEvent} from './src/calendar';

export {
    requestContact,
    fetchContactsByPhone,
    fetchPhoneNumbers,
    updatePhoneNumbers,
} from './src/contacts';

export {highlightNavigationTab} from './src/navigation-tabs';

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

export {showAppRating} from './src/app-rating';

export {bottomSheet} from './src/bottom-sheet';
export type {
    SheetRowItem,
    SheetActionItem,
    SheetInfoItem,
} from './src/bottom-sheet';

export {openOnboarding} from './src/open-onboarding';

export {getProfileImage, startProfileImageFlow} from './src/profile';
export {readTextFromClipboard, writeTextToClipboard} from './src/clipboard';
