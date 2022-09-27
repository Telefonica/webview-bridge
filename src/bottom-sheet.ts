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

let sheetLock = false;

export const bottomSheet = async (payload: SheetUI): Promise<SheetResponse> => {
    if (sheetLock) {
        throw {
            code: 423,
            reason: 'BottomSheet is locked. You can only have one bottom sheet in the screen',
        };
    }

    sheetLock = true;
    const tid = setTimeout(() => {
        sheetLock = false;
    }, 1000);

    try {
        const response = await postMessageToNativeApp({type: 'SHEET', payload});
        sheetLock = false;
        clearTimeout(tid);
        return response;
    } catch (e) {
        sheetLock = false;
        clearTimeout(tid);
        throw e;
    }
};

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
}): Promise<
    | {
          action: 'SUBMIT';
          selectedId: string;
      }
    | {
          action: 'DISMISS';
          selectedId: null;
      }
> =>
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
    }).then(({action, result}) => {
        if (action === 'SUBMIT') {
            return {
                action,
                selectedId: result[0].selectedIds[0],
            };
        } else {
            return {
                action,
                selectedId: null,
            };
        }
    });
