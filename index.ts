export {isWebViewBridgeAvailable} from './src/post-message';
export {nativeConfirm, nativeAlert, nativeMessage} from './src/dialogs';
export {requestSimIcc, requestSimImsi, requestDeviceImei} from './src/device';
export {
    attachToEmail,
    setWebViewTitle,
    updateNavigationBar,
    notifyPageLoaded,
} from './src/utils';
export {createCalendarEvent} from './src/calendar';
export {requestContact} from './src/contacts';
export {
    logEvent,
    logTiming,
    setScreenName,
    setUserProperty,
    CD_WEBAPP_INSTALLED,
    CD_NOVUM_UID,
    CD_EVENT_VALUE,
} from './src/analytics';
