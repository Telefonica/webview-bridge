import {postMessageToNativeApp, type SheetResponse} from './post-message';

export type SheetRowItem = Readonly<{
    id: string;
    title?: string;
    description?: string;
    icon?: Readonly<{
        url: string;
        urlDark?: string;
        size?: 'large' | 'small'; // large=40px (default), small=24px
    }>;
}>;

export type SheetActionItem = Readonly<{
    id: string;
    title: string;
    style?: 'normal' | 'destructive'; // "normal" by default
    icon?: Readonly<{
        url: string;
        urlDark?: string;
    }>;
}>;

type InfoIcon =
    | Readonly<{
          url: string;
          urlDark?: string;
          type: 'regular' | 'small';
      }>
    | Readonly<{type: 'bullet'}>;

export type SheetInfoItem = Readonly<{
    id: string;
    title: string;
    description?: string;
    icon: InfoIcon;
}>;

type SheetUIElement =
    | Readonly<{
          id: string;
          type: 'LIST';
          listType: 'SINGLE_SELECTION';
          autoSubmit?: boolean;
          selectedIds: Array<string>;
          items: Array<SheetRowItem>;
      }>
    | Readonly<{
          id: string;
          type: 'LIST';
          listType: 'ACTIONS';
          autoSubmit?: boolean;
          selectedIds: Array<string>;
          items: Array<SheetActionItem>;
      }>
    | Readonly<{
          id: string;
          type: 'LIST';
          listType: 'INFORMATIVE';
          autoSubmit?: boolean;
          selectedIds: Array<string>;
          items: Array<SheetInfoItem>;
      }>
    | Readonly<{
          id: string;
          type: 'BOTTOM_ACTIONS';
          button: {
              text: string;
          };
          secondaryButton?: {
              text: string;
          };
          link?: {
              text: string;
              withChevron?: boolean;
          };
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
    items: Array<SheetRowItem>;
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

export const bottomSheetActionSelector = ({
    title,
    subtitle,
    description,
    items,
}: {
    title?: string;
    subtitle?: string;
    description?: string;
    items: Array<SheetActionItem>;
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
                listType: 'ACTIONS',
                autoSubmit: true,
                selectedIds: [],
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

export const bottomSheetInfo = async ({
    title,
    subtitle,
    description,
    items,
}: {
    title?: string;
    subtitle?: string;
    description?: string;
    items: Array<SheetInfoItem>;
}): Promise<void> => {
    await bottomSheet({
        title,
        subtitle,
        description,
        content: [
            {
                type: 'LIST',
                id: 'list-0',
                listType: 'INFORMATIVE',
                autoSubmit: false,
                selectedIds: [],
                items,
            },
        ],
    });
};

export const bottomSheetActions = async ({
    title,
    subtitle,
    description,
    button,
    secondaryButton,
    link,
}: {
    title?: string;
    subtitle?: string;
    description?: string;
    button: {
        text: string;
    };
    secondaryButton?: {
        text: string;
    };
    link?: {
        text: string;
        withChevron?: boolean;
    };
}): Promise<{
    action: 'PRIMARY' | 'SECONDARY' | 'LINK' | 'DISMISS';
}> => {
    return bottomSheet({
        title,
        subtitle,
        description,
        content: [
            {
                type: 'BOTTOM_ACTIONS',
                id: 'bottom-actions-0',
                button,
                secondaryButton,
                link,
            },
        ],
    }).then(({action, result}) => {
        if (action === 'SUBMIT') {
            const bottomActionsResult = result.find(
                ({id}) => id === 'bottom-actions-0',
            );
            const pressedAction = bottomActionsResult?.selectedIds[0];
            if (
                pressedAction === 'PRIMARY' ||
                pressedAction === 'SECONDARY' ||
                pressedAction === 'LINK'
            ) {
                return {
                    action: pressedAction,
                };
            }
        }
        return {
            action: 'DISMISS',
        };
    });
};
