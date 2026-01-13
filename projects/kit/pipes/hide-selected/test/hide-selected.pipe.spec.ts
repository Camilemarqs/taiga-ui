import {signal, type WritableSignal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {TUI_FALSE_HANDLER} from '@taiga-ui/cdk';
import {TUI_ITEMS_HANDLERS, TuiTextfieldMultiComponent} from '@taiga-ui/core';
import {TuiHideSelectedPipe} from '@taiga-ui/kit';

interface Item {
    id?: number;
}

type IdentityMatcher<T> = (a: T, b: T) => boolean;

interface ItemsHandlers<T> {
    identityMatcher: WritableSignal<IdentityMatcher<T>>;
}

interface TextfieldMulti<T> {
    cva: WritableSignal<{value: WritableSignal<T[]>}>;
}

describe('HideSelected pipe', () => {
    let handlers: ItemsHandlers<Item>;
    let textfield: TextfieldMulti<Item>;
    let pipe: TuiHideSelectedPipe;

    beforeEach(() => {
        textfield = {
            cva: signal({value: signal<Item[]>([])}),
        };

        handlers = {
            identityMatcher: signal<IdentityMatcher<Item>>(TUI_FALSE_HANDLER),
        };

        TestBed.overrideProvider(TuiTextfieldMultiComponent, {useValue: textfield})
            .overrideProvider(TUI_ITEMS_HANDLERS, {useValue: handlers})
            .runInInjectionContext(() => {
                pipe = new TuiHideSelectedPipe();
            });
    });

    it('works for flat arrays', () => {
        handlers.identityMatcher.set((a, b) => a === b);
        textfield.cva().value.set([1 as unknown as Item, 2 as unknown as Item, 3 as unknown as Item]);

        expect(pipe.transform([1 as unknown as Item, 4 as unknown as Item, 5 as unknown as Item]))
            .toEqual([4 as unknown as Item, 5 as unknown as Item]);
    });

    it('works for 2d arrays', () => {
        handlers.identityMatcher.set((a, b) => a === b);
        textfield.cva().value.set([1 as unknown as Item, 2 as unknown as Item, 3 as unknown as Item]);

        expect(
            pipe.transform([
                [1 as unknown as Item, 4 as unknown as Item, 5 as unknown as Item],
                [2 as unknown as Item, 3 as unknown as Item, 6 as unknown as Item],
            ]),
        ).toEqual([
            [4 as unknown as Item, 5 as unknown as Item],
            [6 as unknown as Item],
        ]);
    });

    it('works with flat array and custom matcher', () => {
        handlers.identityMatcher.set((a, b) => a.id === b.id);
        textfield.cva().value.set([{id: 1}, {id: 2}]);

        expect(pipe.transform([{id: 1}, {id: 3}])).toEqual([{id: 3}]);
    });

    it('works with 2d array and custom matcher', () => {
        handlers.identityMatcher.set((a, b) => a.id === b.id);
        textfield.cva().value.set([{id: 1}, {id: 2}]);

        expect(pipe.transform([[{id: 1}, {id: 3}], [{id: 2}]])).toEqual([[{id: 3}], []]);
    });
});