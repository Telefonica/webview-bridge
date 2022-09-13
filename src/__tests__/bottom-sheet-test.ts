import {bottomSheetSingleSelector} from '../bottom-sheet';
import {createFakeAndroidPostMessage} from './fake-post-message';

test('single selection', (done) => {
    const title = 'any title';
    const subtitle = 'any subtitle';
    const description = 'any description';
    const selectedId = 'item-0';
    const items = [
        {
            id: 'item-0',
            title: 'item 0 title',
            description: 'item 0 description',
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
                        selected: ['item-2'],
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
        expect(res).toEqual({action: 'SUBMIT', selected: 'item-2'});
        done();
    });
});
