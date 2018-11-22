import {getId} from '../message-id';

test('getId creates different ids', () => {
    const ids = new Set();

    for (let i = 0; i < 1000; i++) {
        const id = getId();
        expect(ids.has(id)).toBeFalsy;
        ids.add(id);
    }
});
