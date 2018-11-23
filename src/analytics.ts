// Google Analytics custom dimension indices.
// WARN: These numbers are defined in GA, don't change them

type CustomDimensionIdx = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const CD_OB_IDS: CustomDimensionIdx = 1; // from sessionInfo
const CD_PAYMENT_MODELS: CustomDimensionIdx = 2; // from sessionInfo
const CD_SERVICE_WORKER_STATUS: CustomDimensionIdx = 3;
export const CD_WEBAPP_INSTALLED: CustomDimensionIdx = 4;
const CD_SUBSCRIPTION_ADMIN: CustomDimensionIdx = 5; // from sessionInfo
const CD_SUBSCRIPTION_WITH_IPCOMMS: CustomDimensionIdx = 6; // from sessionInfo
export const CD_NOVUM_UID: CustomDimensionIdx = 7;
export const CD_EVENT_VALUE: CustomDimensionIdx = 8;

const withAnalytics = ({
    onAndroid,
    onIos,
    onWeb,
}: {
    onAndroid: (fb: AndroidFirebase) => Promise<void>;
    onIos: (fb: IosFirebase) => Promise<void>;
    onWeb: (ga: WebGoogleAnalytics) => Promise<void>;
}) => {
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
        // @ts-ignore
    } else if (window.ga && window.ga.loaded) {
        // Use Google Analytics when webapp is outside the native app webview
        return onWeb(window.ga);
    } else {
        return Promise.resolve();
    }
};

type TrackingEvent = {
    category: string; // Typically the object that was interacted with (e.g. 'Video')
    action: string; // The type of interaction (e.g. 'play')
    label?: string; // Useful for categorizing events (e.g. 'Fall Campaign')
    value?: number; // A numeric value associated with the event (e.g. 43)
    [key: string]: any;
};

export const logEvent = ({
    category,
    action,
    label,
    value,
    ...fieldsObject
}: TrackingEvent) => {
    if (!category || !action) {
        console.warn('Analytics event should have "category" and "action"', {
            category,
            action,
        });
        return Promise.resolve();
    }

    const name = category;

    const params = {
        eventCategory: category,
        eventAction: action,
        eventLabel: label,
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
            return new Promise(resolve => {
                ga('send', 'event', {...params, hitCallback: resolve});
            });
        },
    });
};

export const logTiming = ({
    category = 'development_timer',
    variable,
    value,
    label,
}: {
    category?: string; // For categorizing all user timing variables into logical groups (e.g. 'JS Dependencies').
    variable: string; // The variable being recorded (e.g. 'load').
    value: number; // The number of milliseconds in elapsed time to report (e.g. 20).
    label?: string; // Can be used to add flexibility in visualizing user timings in the reports (e.g. 'Google CDN').
}) => {
    if (!category || !variable || !value) {
        console.warn(
            'Analytics timing should have "category", "variable" and "value"',
            {category, variable, value},
        );
        return Promise.resolve();
    }

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
            return new Promise(resolve => {
                ga('send', {
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

export const setScreenName = (screenName: string, fieldsObject?: {}) => {
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
                screenName,
            });
            return Promise.resolve();
        },
        onWeb(ga) {
            return new Promise(resolve => {
                // Page name should start with '/'
                const pageName = screenName.startsWith('/')
                    ? screenName
                    : `/${screenName}`;

                if (pageName !== currentPageName) {
                    currentPageName = pageName;
                    ga(() => {
                        // we have two trackers in movistar ARG, we want to track the PV in both trackers
                        const trackers = ga.getAll();
                        trackers.forEach(tracker => {
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

const USER_PROPERTY_TO_CUSTOM_DIMENSION = {
    obIds: CD_OB_IDS,
    paymentModels: CD_PAYMENT_MODELS,
    serviceWorkerStatus: CD_SERVICE_WORKER_STATUS,
    isAdmin: CD_SUBSCRIPTION_ADMIN,
    hasIpComms: CD_SUBSCRIPTION_WITH_IPCOMMS,
};

type UserPropertyName = keyof typeof USER_PROPERTY_TO_CUSTOM_DIMENSION;

export const setUserProperty = (name: UserPropertyName, value: string) => {
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

            ga('set', {[`dimension${dimensionIdx}`]: String(value)});
            return Promise.resolve();
        },
    });
};
