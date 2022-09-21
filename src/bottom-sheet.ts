import {postMessageToNativeApp, type SheetResponse} from './post-message';

type SheetListType = 'SINGLE_SELECTION';

export type SheetListItem = Readonly<{
    id: string;
    title?: string;
    description?: string;
    icon?: Readonly<{
        url: string;
        urlDark?: string;
    }>;
}>;

type SheetUIElement = Readonly<{
    id: string;
    type: 'LIST';
    listType: SheetListType;
    autoSubmit?: boolean;
    selectedIds: Array<string>;
    items: Array<SheetListItem>;
}>;

type SheetUI = Readonly<{
    title?: string;
    subtitle?: string;
    description?: string;
    content: Array<SheetUIElement>;
}>;

export const bottomSheet = (payload: SheetUI): Promise<SheetResponse> =>
    postMessageToNativeApp({type: 'SHEET', payload});

export const bottomSheetSingleSelector = ({
    title,
    subtitle,
    description,
    selectedId,
    items,
}: {
    title?: string;
    subtitle?: string;
    description?: string;
    selectedId?: string;
    items: Array<SheetListItem>;
}): Promise<{action: 'SUBMIT' | 'DISMISS'; selectedId: string}> =>
    bottomSheet({
        title,
        subtitle,
        description,
        content: [
            {
                type: 'LIST',
                id: 'list-0',
                listType: 'SINGLE_SELECTION',
                autoSubmit: true,
                selectedIds: typeof selectedId === 'string' ? [selectedId] : [],
                items,
            },
        ],
    }).then(({action, result}) => ({
        action,
        selectedId: result[0].selectedIds[0],
    }));
