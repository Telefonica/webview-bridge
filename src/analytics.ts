import {postMessageToNativeApp} from './post-message';

/** @deprecated */
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

/** @deprecated */
export const CD_WEBAPP_INSTALLED = 4;
/** @deprecated */
export const CD_NOVUM_UID = 7;
/** @deprecated */
export const CD_EVENT_VALUE = 8;

const DEFAULT_EVENT_LABEL = 'null_label';
const DEFAULT_EVENT_VALUE = 0;

const CALLBACK_TIMEOUT = 500;
const MAX_TIMEOUT_TIMES = 3;
let timeoutCounter = 0;
const createCallback = (resolve: () => void) => {
    // Analytics may fail to load (for example, if blocked by an adblocker). If that happens, we still need to resolve
    // the logEvent promises, so we stablish a timeout for those cases.
    // If the log times out more than MAX_TIMEOUT_TIMES times consecutively, we don't try to send more events and inmediately resolve
    // all the promises.
    const tid = setTimeout(() => {
        resolve();
        timeoutCounter++;
    }, CALLBACK_TIMEOUT);

    return () => {
        clearTimeout(tid);
        timeoutCounter = 0;
        resolve();
    };
};

const withAnalytics = ({
    onAndroid,
    onIos,
    onWeb,
}: {
    onAndroid: (fb: AndroidFirebase) => Promise<void>;
    onIos: (fb: IosFirebase) => Promise<void>;
    onWeb: (gtag: Gtag.Gtag) => Promise<void>;
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
        // @ts-ignore TS thinks gtag is always available, but it may not be the case if the page has not loaded the gtag script
        window.gtag &&
        timeoutCounter < MAX_TIMEOUT_TIMES
    ) {
        // Use Google Analytics when webapp is outside the native app webview
        return onWeb(window.gtag);
    } else {
        return Promise.resolve();
    }
};

type LegacyAnalyticsEvent = {
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
};

type FirebaseEvent = {
    name: string;
    component_type?: string;
    component_copy?: string;
    [key: string]: any;
};

export type TrackingEvent = Readonly<LegacyAnalyticsEvent | FirebaseEvent>;

const removeAccents = (str: string) =>
    // Normalize to NFD (normal form decomposition) and delete Combining Diacritical Marks Unicode
    // https://stackoverflow.com/a/37511463/3874587
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const EVENT_PARAM_NAME_CHARS_LIMIT = 40;
const EVENT_PARAM_VALUE_CHARS_LIMIT = 100;
const EVENT_PARAMS_LIMIT = 25;

export const sanitizeAnalyticsParam = (str: string): string =>
    removeAccents(str)
        .toLocaleLowerCase()
        .replace(/[^a-z0-9\s\-\_\/\|\:]/g, '') // Remove all non allowed characters
        .replace(/\s+/g, ' ') // Replace repeated whitespaces with a single space
        .trim()
        .replace(/\s/g, '_') // Replace spaces with underscores
        .slice(0, EVENT_PARAM_VALUE_CHARS_LIMIT);

export const sanitizeAnalyticsParams = (params: {
    [key: string]: unknown;
}): {[key: string]: unknown} => {
    const sanitizedParams: {[key: string]: unknown} = {};
    Object.entries(params).forEach(([key, value]) => {
        let sanitizedValue = value;
        const sanitizedKey = key.slice(0, EVENT_PARAM_NAME_CHARS_LIMIT);
        if (typeof value === 'string') {
            // Some string params may contain strings with accents (some of them may be copies/translations), so we need to sanitize them
            sanitizedValue = sanitizeAnalyticsParam(value);
        }
        sanitizedParams[sanitizedKey] = sanitizedValue;
    });
    return sanitizedParams;
};

const getLegacyAnalyticsEventParams = ({
    category,
    action,
    label,
    value,
    ...fieldsObject
}: LegacyAnalyticsEvent) => {
    if (!label) {
        label = DEFAULT_EVENT_LABEL;
    }

    if (!value) {
        value = DEFAULT_EVENT_VALUE;
    }

    return {
        eventCategory: category,
        eventAction: action,
        eventLabel: removeAccents(label),
        eventValue: value,
        ...fieldsObject,
    };
};

type LogEventOptions = {
    /** Whether to sanitize the event params, this only affects to FirebaseEvents. true by default. */
    sanitize?: boolean;
};
const defaultEventOptions = {sanitize: true};

let currentScreenName = '';

export const logEvent = (
    event: TrackingEvent,
    options?: LogEventOptions,
): Promise<void> => {
    const {sanitize} = {...defaultEventOptions, ...options};
    let {name, ...params} = event;

    // If the event doesn't have a name, it's a legacy analytics event
    if (!name) {
        if (!event.category || !event.action) {
            console.warn(
                'LegacyAnalyticsEvent should have "category" and "action"',
                {
                    category: event.category,
                    action: event.action,
                },
            );
            return Promise.resolve();
        }
        params = getLegacyAnalyticsEventParams(event as LegacyAnalyticsEvent);
        name = event.category;
    } else {
        if (Object.keys(params).length > EVENT_PARAMS_LIMIT) {
            console.warn(
                `Trying to log FirebaseEvent with name ${name} exceeding the limit of ${EVENT_PARAMS_LIMIT} params`,
            );
        }
        if (sanitize) {
            params = sanitizeAnalyticsParams(params);
            name = sanitizeAnalyticsParam(name);
        }
    }

    // set screen name if not set
    params = {...params, screenName: params.screenName || currentScreenName};

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
        onWeb(gtag) {
            return new Promise((resolve) => {
                gtag('event', name, {
                    ...params,
                    event_callback: createCallback(resolve),
                });
            });
        },
    });
};

export const logEcommerceEvent = (
    name: string,
    params: {[key: string]: any},
): Promise<void> => {
    // set screen name if not set
    params = {...params, screenName: params.screenName || currentScreenName};

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
        onWeb() {
            // not implemented on web
            return Promise.resolve();
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
        onWeb() {
            return new Promise((resolve) => {
                gtag('event', name, {
                    ...params,
                    event_callback: createCallback(resolve),
                });
            });
        },
    });
};

export const setScreenName = (
    screenName: string,
    params?: {[key: string]: any},
): Promise<void> => {
    if (!screenName) {
        console.warn('Missing analytics screenName');
        return Promise.resolve();
    }

    const previousScreenName = currentScreenName;
    currentScreenName = screenName;

    return withAnalytics({
        onAndroid(androidFirebase) {
            // The method to send params with the screen name is only implemented in new app versions.
            if (androidFirebase.setScreenNameWithParams) {
                androidFirebase.setScreenNameWithParams(
                    screenName,
                    JSON.stringify(params),
                );
            } else if (androidFirebase.setScreenName) {
                androidFirebase.setScreenName(screenName);
            }
            return Promise.resolve();
        },
        onIos(iosFirebase) {
            iosFirebase.postMessage({
                command: 'setScreenName',
                name: screenName,
                parameters: params,
            });
            return Promise.resolve();
        },
        onWeb(gtag) {
            return new Promise((resolve) => {
                gtag('event', 'page_view', {
                    screenName,
                    page_title: screenName,
                    previousScreenName,
                    ...sanitizeAnalyticsParams(params ?? {}),
                    event_callback: createCallback(resolve),
                });
            });
        },
    });
};

type KnownUserPropertyName =
    | 'obIds'
    | 'paymentModels'
    | 'serviceWorkerStatus'
    | 'isAdmin'
    | 'hasIpComms'
    | 'af_source'
    | 'af_campaign'
    | 'novum_uid_session'
    | 'user_logged'
    | 'currentSubscriptionId'
    | 'currentSubscriptionType'
    | 'currentPaymentModel'
    | 'webviewBrowserVersion'
    | 'activatedRoles'
    | 'appInstanceId'
    | 'experimentflag'
    | 'friendsApps'
    | 'accountLineSelector'
    | 'OneClickDisplayed';

export const setUserProperty = (
    name: KnownUserPropertyName | string,
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
        onWeb(gtag) {
            gtag('set', 'user_properties', {
                [name]: sanitizeAnalyticsParam(value),
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
