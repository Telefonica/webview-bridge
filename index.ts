export {
    isWebViewBridgeAvailable,
    onNativeEvent,
    NativeEventHandler,
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
    isABTestingAvailable,
    reportStatus,
    fetch,
    checkPermissionStatus,
    getAppMetadata,
    setActionBehavior,
} from './src/utils';
export {createCalendarEvent} from './src/calendar';
export {requestContact, fetchContactsByPhone} from './src/contacts';
export {
    logEvent,
    logTiming,
    setScreenName,
    setUserProperty,
    CD_WEBAPP_INSTALLED,
    CD_NOVUM_UID,
    CD_EVENT_VALUE,
    setCustomerHash,
    getCustomerHash,
    setTrackingProperty,
    type TrackingEvent,
} from './src/analytics';
export {renewSession, onSessionRenewed} from './src/sessions';
