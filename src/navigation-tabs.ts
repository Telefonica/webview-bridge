import {postMessageToNativeApp} from './post-message';

export const highlightNavigationTab = ({
    tab,
    highlight,
    count,
}: {
    tab: string; // "acount", "explore", "start", etc
    highlight: boolean; // whether to highlight or unhighlight
    count?: number; // badge number
}): Promise<void> =>
    postMessageToNativeApp({
        type: 'HIGHLIGHT_TAB',
        payload: {
            tab,
            highlight,
            count,
        },
    });

/**
 * Request the app to refresh the navigation bars
 */
export const refreshNavBar = ({
    moduleId,
    productId,
}: {
    moduleId?: string; // module id used in Visual Modules API
    productId?: string; // identifier of the product as it is in Subscribed Products API
}): Promise<void> =>
    postMessageToNativeApp({
        type: 'REFRESH_NAV_BAR',
        payload: {
            moduleId,
            productId,
        },
    });
