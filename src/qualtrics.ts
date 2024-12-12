import {postMessageToNativeApp} from './post-message';

export const displayQualtricsIntercept = ({
    interceptId,
}: {
    interceptId: string;
}): Promise<{displayed: true}> =>
    postMessageToNativeApp({
        type: 'DISPLAY_QUALTRICS_INTERCEPT',
        payload: {interceptId},
    });

type QualtricsProperty<T> = {
    key: string;
    value: T;
};

export const setQualtricsProperties = ({
    stringProperties,
    numberProperties,
    dateTimePropertyKeys,
}: {
    stringProperties: Array<QualtricsProperty<string>>;
    numberProperties: Array<QualtricsProperty<number>>;
    dateTimePropertyKeys: Array<string>;
}): Promise<void> =>
    postMessageToNativeApp({
        type: 'SET_QUALTRICS_PROPERTIES',
        payload: {stringProperties, numberProperties, dateTimePropertyKeys},
    });

export const isQualtricsInterceptAvailableForUser = ({
    interceptId,
}: {
    interceptId: string;
}): Promise<{isAvailable: boolean}> =>
    postMessageToNativeApp({
        type: 'IS_QUALTRICS_INTERCEPT_AVAILABLE_FOR_USER',
        payload: {interceptId},
    });
