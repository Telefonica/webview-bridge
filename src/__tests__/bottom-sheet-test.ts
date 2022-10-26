import {
    bottomSheetActionSelector,
    bottomSheetInfo,
    bottomSheetSingleSelector,
    SheetActionItem,
    SheetInfoItem,
} from '../bottom-sheet';
import {createFakeAndroidPostMessage} from './fake-post-message';

import type {SheetRowItem} from '../bottom-sheet';

test('single selection', (done) => {
    const title = 'any title';
    const subtitle = 'any subtitle';
    const description = 'any description';
    const selectedId = 'item-0';
    const items: Array<SheetRowItem> = [
        {
            id: 'item-0',
            title: 'item 0 title',
            description: 'item 0 description',
            icon: {
                url: 'https://example.com/icon.png',
                urlDark: 'https://example.com/dark-icon.png',
            },
        },
        {
            id: 'item-1',
            title: 'item 1 title',
            description: 'item 1 description',
        },
        {
            id: 'item-2',
            title: 'item 2 title',
            description: 'item 2 description',
        },
    ];

    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('SHEET');
            expect(message.payload).toEqual({
                title,
                subtitle,
                description,
                content: [
                    {
                        id: 'list-0',
                        type: 'LIST',
                        listType: 'SINGLE_SELECTION',
                        autoSubmit: true,
                        selectedIds: [selectedId],
                        items,
                    },
                ],
            });
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: {
                action: 'SUBMIT',
                result: [
                    {
                        id: 'list-0',
                        selectedIds: ['item-2'],
                    },
                ],
            },
        }),
    });

    bottomSheetSingleSelector({
        title,
        subtitle,
        description,
        selectedId,
        items,
    }).then((res) => {
        expect(res).toEqual({action: 'SUBMIT', selectedId: 'item-2'});
        done();
    });
});

test('actions', (done) => {
    const title = 'any title';
    const subtitle = 'any subtitle';
    const description = 'any description';
    const items: Array<SheetActionItem> = [
        {
            id: 'item-0',
            title: 'item 0 title',
            icon: {
                url: 'https://example.com/icon.png',
                urlDark: 'https://example.com/dark-icon.png',
            },
        },
        {
            id: 'item-1',
            title: 'item 1 title',
            style: 'normal',
        },
        {
            id: 'item-2',
            title: 'item 2 title',
            style: 'destructive',
        },
    ];

    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('SHEET');
            expect(message.payload).toEqual({
                title,
                subtitle,
                description,
                content: [
                    {
                        id: 'list-0',
                        type: 'LIST',
                        listType: 'ACTIONS',
                        autoSubmit: true,
                        selectedIds: [],
                        items,
                    },
                ],
            });
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: {
                action: 'SUBMIT',
                result: [
                    {
                        id: 'list-0',
                        selectedIds: ['item-2'],
                    },
                ],
            },
        }),
    });

    bottomSheetActionSelector({
        title,
        subtitle,
        description,
        items,
    }).then((res) => {
        expect(res).toEqual({action: 'SUBMIT', selectedId: 'item-2'});
        done();
    });
});

test('informative', (done) => {
    const title = 'any title';
    const subtitle = 'any subtitle';
    const description = 'any description';
    const items: Array<SheetInfoItem> = [
        {
            id: 'item-0',
            title: 'item 0 title',
            icon: {
                url: 'https://example.com/icon.png',
                urlDark: 'https://example.com/dark-icon.png',
                type: 'regular',
            },
        },
        {
            id: 'item-1',
            title: 'item 1 title',
            icon: {
                type: 'small',
                url: 'https://example.com/icon.png',
            },
        },
        {
            id: 'item-2',
            title: 'item 2 title',
            icon: {
                type: 'bullet',
            },
        },
    ];

    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('SHEET');
            expect(message.payload).toEqual({
                title,
                subtitle,
                description,
                content: [
                    {
                        id: 'list-0',
                        type: 'LIST',
                        listType: 'INFORMATIVE',
                        autoSubmit: false,
                        selectedIds: [],
                        items,
                    },
                ],
            });
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: {
                action: 'SUBMIT',
                result: [
                    {
                        id: 'list-0',
                        selectedIds: ['item-2'],
                    },
                ],
            },
        }),
    });

    bottomSheetInfo({
        title,
        subtitle,
        description,
        items,
    }).then((res) => {
        expect(res).toBe(undefined);
        done();
    });
});
