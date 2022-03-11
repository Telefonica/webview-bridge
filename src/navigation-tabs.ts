import {postMessageToNativeApp} from './post-message';

export const highlightNavigationTab = ({
    tab,
    highlight,
    count,
}: {
    tab: number; // "acount", "explore", "start", etc
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
