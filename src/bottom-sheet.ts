import {postMessageToNativeApp, type SheetResponse} from './post-message';

type SheetListType = 'SINGLE_SELECTION';

type ListItemIcon =
    | {
          iconType: 'native_key';
          nativeKeyValue:
              | 'mart_wifi_regular'
              | 'mobile_device_regular'
              | 'home_wifi_regular'
              | 'wifi_regular'
              | 'tv_content_regular'
              | 'call_landline_regular';
      }
    | {
          iconType: 'url';
          urlValueLight: string;
          urlValueDark?: string;
      };

export type SheetListItem = {
    id: string;
    title?: string;
    description?: string;
    icon?: ListItemIcon;
};

type SheetUIElement = {
    id: string;
    type: 'LIST';
    listType: SheetListType;
    autoSubmit?: boolean;
    selectedIds: Array<string>;
    items: Array<SheetListItem>;
};

type SheetUI = {
    title?: string;
    subtitle?: string;
    description?: string;
    content: Array<SheetUIElement>;
};

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
