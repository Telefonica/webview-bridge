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
} from './src/analytics';
