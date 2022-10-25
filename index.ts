export {
    isWebViewBridgeAvailable,
    onNativeEvent,
    NativeEventHandler,
    setLogger,
} from './src/post-message';

export {nativeConfirm, nativeAlert, nativeMessage} from './src/dialogs';

export {
    requestSimIcc,
    requestSimImsi,
    requestDeviceImei,
    internalNavigation,
    dismiss,
    requestVibration,
    getDiskSpaceInfo,
    getEsimInfo,
} from './src/device';

export {
    attachToEmail,
    share,
    setWebViewTitle,
    updateNavigationBar,
    notifyPageLoaded,
    notifyBridgeReady,
    isABTestingAvailable,
    reportStatus,
    fetch,
    checkPermissionStatus,
    getAppMetadata,
    setActionBehavior,
    getTopazToken,
} from './src/utils';
export type {ShareOptions} from './src/utils';

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
    setCustomerHash,
    getCustomerHash,
    setTrackingProperty,
    sanitizeAnalyticsParam,
    sanitizeAnalyticsParams,
} from './src/analytics';
export type {TrackingEvent, CustomDimensionIdx} from './src/analytics';

export {renewSession, onSessionRenewed, logout} from './src/sessions';

export {showAppRating} from './src/app-rating';

export {bottomSheet, bottomSheetSingleSelector} from './src/bottom-sheet';
export type {SheetListItem} from './src/bottom-sheet';
