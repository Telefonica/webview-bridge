import {postMessageToNativeApp} from './post-message';

// Google Analytics custom dimension indices.
// WARN: These numbers are defined in GA, don't change them
export type CustomDimensionIdx =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 24
    | 25
    | 26;

const CD_OB_IDS: CustomDimensionIdx = 1; // from sessionInfo
const CD_PAYMENT_MODELS: CustomDimensionIdx = 2; // from sessionInfo
const CD_SERVICE_WORKER_STATUS: CustomDimensionIdx = 3;
export const CD_WEBAPP_INSTALLED: CustomDimensionIdx = 4;
const CD_SUBSCRIPTION_ADMIN: CustomDimensionIdx = 5; // from sessionInfo
const CD_SUBSCRIPTION_WITH_IPCOMMS: CustomDimensionIdx = 6; // from sessionInfo
export const CD_NOVUM_UID: CustomDimensionIdx = 7;
export const CD_EVENT_VALUE: CustomDimensionIdx = 8;
const CD_AF_SOURCE: CustomDimensionIdx = 9;
const CD_AF_CAMPAIGN: CustomDimensionIdx = 10;
const CD_NOVUM_UID_SESSION: CustomDimensionIdx = 11;
const CD_USER_LOGGED: CustomDimensionIdx = 12;
const CD_CURRENT_SUBSCRIPTION_ID: CustomDimensionIdx = 13;
const CD_CURRENT_SUBSCRIPTION_TYPE: CustomDimensionIdx = 14;
const CD_CURRENT_PAYMENT_MODEL: CustomDimensionIdx = 15;
const CD_WEBVIEW_BROWSER_VERSION: CustomDimensionIdx = 16;
const CD_ACTIVATED_ROLES: CustomDimensionIdx = 17;
const CD_APP_INSTANCE_ID: CustomDimensionIdx = 18;
const CD_EXPERIMENT_FLAG: CustomDimensionIdx = 20;
const CD_FRIENDS_APPS: CustomDimensionIdx = 24;
const CD_ACOUNT_LINE_SELECTOR: CustomDimensionIdx = 25;
const CD_ONE_CLICK_DISPLAYED: CustomDimensionIdx = 26;

const DEFAULT_EVENT_LABEL = 'null_label';
const DEFAULT_EVENT_VALUE = 0;

const VALID_TRACKERS = ['NovumTracker', 'OBARGTracker'];

const isTrackerValid = (tracker: UniversalAnalytics.Tracker) =>
    VALID_TRACKERS.indexOf(tracker.get('name')) >= 0;

const withAnalytics = ({
    onAndroid,
    onIos,
    onWeb,
}: {
    onAndroid: (fb: AndroidFirebase) => Promise<void>;
    onIos: (fb: IosFirebase) => Promise<void>;
    onWeb: (ga: WebGoogleAnalytics) => Promise<void>;
}) => {
    if (typeof window === 'undefined') {
        return Promise.resolve();
    }
    if (window.AnalyticsWebInterface) {
        // Call Android interface
        return onAndroid(window.AnalyticsWebInterface);
    } else if (
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.firebase
    ) {
        // Call iOS interface
        return onIos(window.webkit.messageHandlers.firebase);
    } else if (
        window.ga &&
        // @ts-ignore
        window.ga.loaded
    ) {
        // Use Google Analytics when webapp is outside the native app webview
        return onWeb(window.ga);
    } else {
        return Promise.resolve();
    }
};

export type TrackingEvent = Readonly<{
    /** Typically the object that was interacted with (e.g. 'Video') */
    category: string;
    /** The type of interaction (e.g. 'play') */
    action: string;
    /** Useful for categorizing events (e.g. 'Fall Campaign') */
    label?: string;
    /** A numeric value associated with the event (e.g. 43) */
    value?: number;
    /**
     * Screen name where the event happened.
     * If not specified, native app will use value from the latest setScreenName() call
     */
    screenName?: string;
    /** Other properties are allowed */
    [key: string]: any;
}>;

const formatLabel = (label: string) =>
    // Normalize to NFD (normal form decomposes and delete Combining Diacritical Marks Unicode
    // https://stackoverflow.com/a/37511463/3874587
    label.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const logEvent = ({
    category,
    action,
    label,
    value,
    ...fieldsObject
}: TrackingEvent): Promise<void> => {
    if (!category || !action) {
        console.warn('Analytics event should have "category" and "action"', {
            category,
            action,
        });
        return Promise.resolve();
    }

    const name = category;

    if (!label) {
        label = DEFAULT_EVENT_LABEL;
    }

    if (!value) {
        value = DEFAULT_EVENT_VALUE;
    }

    const params = {
        eventCategory: category,
        eventAction: action,
        eventLabel: formatLabel(label),
        eventValue: value,
        ...fieldsObject,
    };

    return withAnalytics({
        onAndroid(androidFirebase) {
            if (androidFirebase.logEvent) {
                androidFirebase.logEvent(name, JSON.stringify(params));
            }
            return Promise.resolve();
        },
        onIos(iosFirebase) {
            iosFirebase.postMessage({
                command: 'logEvent',
                name,
                parameters: params,
            });
            return Promise.resolve();
        },
        onWeb(ga) {
            return new Promise((resolve) => {
                ga('NovumTracker.send', 'event', {
                    ...params,
                    hitCallback: resolve,
                });
            });
        },
    });
};

export const logTiming = ({
    category = 'performance_timer',
    variable,
    value,
    label,
}: Readonly<{
    category?: string; // For categorizing all user timing variables into logical groups (e.g. 'JS Dependencies').
    variable: string; // The variable being recorded (e.g. 'load').
    value: number; // The number of milliseconds in elapsed time to report (e.g. 20).
    label?: string; // Can be used to add flexibility in visualizing user timings in the reports (e.g. 'Google CDN').
}>): Promise<void> => {
    if (!category || !variable || !value) {
        console.warn(
            'Analytics timing should have "category", "variable" and "value"',
            {category, variable, value},
        );
        return Promise.resolve();
    }

    value = Math.round(value);

    const params = {
        timingCategory: category,
        timingVar: variable,
        timingValue: value,
        timingLabel: label,
    };

    const name = category;

    return withAnalytics({
        onAndroid(androidFirebase) {
            if (androidFirebase.logEvent) {
                androidFirebase.logEvent(name, JSON.stringify(params));
            }
            return Promise.resolve();
        },
        onIos(iosFirebase) {
            iosFirebase.postMessage({
                command: 'logEvent',
                name,
                parameters: params,
            });
            return Promise.resolve();
        },
        onWeb(ga) {
            return new Promise((resolve) => {
                ga('NovumTracker.send', {
                    hitType: 'timing',
                    hitCallback: resolve,
                    [`dimension${CD_EVENT_VALUE}`]: String(value),
                    ...params,
                });
            });
        },
    });
};

let currentPageName: string;

export const setScreenName = (
    screenName: string,
    fieldsObject?: {[key: string]: any},
): Promise<void> => {
    if (!screenName) {
        console.warn('Missing analytics screenName');
        return Promise.resolve();
    }

    return withAnalytics({
        onAndroid(androidFirebase) {
            if (androidFirebase.setScreenName) {
                androidFirebase.setScreenName(screenName);
            }
            return Promise.resolve();
        },
        onIos(iosFirebase) {
            iosFirebase.postMessage({
                command: 'setScreenName',
                name: screenName,
            });
            return Promise.resolve();
        },
        onWeb(ga) {
            return new Promise((resolve) => {
                // Page name should start with '/'
                const pageName = screenName.startsWith('/')
                    ? screenName
                    : `/${screenName}`;

                if (pageName !== currentPageName) {
                    currentPageName = pageName;
                    ga(() => {
                        // we have two trackers in movistar ARG, we want to track the PV in both trackers
                        const trackers = ga.getAll().filter(isTrackerValid);
                        trackers.forEach((tracker) => {
                            tracker.set('page', pageName);
                            tracker.send('pageView', {
                                ...fieldsObject,
                                hitCallback: resolve,
                            });
                        });
                    });
                } else {
                    resolve();
                }
            });
        },
    });
};

const USER_PROPERTY_TO_CUSTOM_DIMENSION: Record<string, number> = {
    obIds: CD_OB_IDS,
    paymentModels: CD_PAYMENT_MODELS,
    serviceWorkerStatus: CD_SERVICE_WORKER_STATUS,
    isAdmin: CD_SUBSCRIPTION_ADMIN,
    hasIpComms: CD_SUBSCRIPTION_WITH_IPCOMMS,
    af_source: CD_AF_SOURCE,
    af_campaign: CD_AF_CAMPAIGN,
    novum_uid_session: CD_NOVUM_UID_SESSION,
    user_logged: CD_USER_LOGGED,
    currentSubscriptionId: CD_CURRENT_SUBSCRIPTION_ID,
    currentSubscriptionType: CD_CURRENT_SUBSCRIPTION_TYPE,
    currentPaymentModel: CD_CURRENT_PAYMENT_MODEL,
    webviewBrowserVersion: CD_WEBVIEW_BROWSER_VERSION,
    activatedRoles: CD_ACTIVATED_ROLES,
    appInstanceId: CD_APP_INSTANCE_ID,
    experimentflag: CD_EXPERIMENT_FLAG,
    friendsApps: CD_FRIENDS_APPS,
    accountLineSelector: CD_ACOUNT_LINE_SELECTOR,
    OneClickDisplayed: CD_ONE_CLICK_DISPLAYED,
};

type UserPropertyName = keyof typeof USER_PROPERTY_TO_CUSTOM_DIMENSION;

export const setUserProperty = (
    name: UserPropertyName | string,
    value: string,
): Promise<void> => {
    if (!name || !value) {
        console.warn(
            'Trying to set analytics user property without name or value',
            name,
            value,
        );
        return Promise.resolve();
    }

    value = String(value);

    return withAnalytics({
        onAndroid(androidFirebase) {
            if (androidFirebase.setUserProperty) {
                androidFirebase.setUserProperty(name, value);
            }
            return Promise.resolve();
        },
        onIos(iosFirebase) {
            iosFirebase.postMessage({
                command: 'setUserProperty',
                name,
                value,
            });
            return Promise.resolve();
        },
        onWeb(ga) {
            const dimensionIdx = USER_PROPERTY_TO_CUSTOM_DIMENSION[name];
            if (!dimensionIdx) {
                console.warn(
                    'No custom dimension defined for user property',
                    name,
                );
                return Promise.resolve();
            }

            ga('NovumTracker.set', {
                [`dimension${dimensionIdx}`]: String(value),
            });
            return Promise.resolve();
        },
    });
};

export const setCustomerHash = (hash: string): Promise<void> =>
    postMessageToNativeApp({
        type: 'SET_CUSTOMER_HASH',
        payload: {
            hash,
        },
    });

export const getCustomerHash = (): Promise<{hash: string}> =>
    postMessageToNativeApp({
        type: 'GET_CUSTOMER_HASH',
    });

export const setTrackingProperty = (
    system: 'palitagem' | 'medallia',
    name: string,
    value?: string,
): Promise<void> =>
    postMessageToNativeApp({
        type: 'SET_TRACKING_PROPERTY',
        payload: {
            system: system,
            name: name,
            value: value,
        },
    }).catch(() => {
        // do nothing
    });
