import {Directive, input, type Signal} from '@angular/core';
import {TUI_TRUE_HANDLER} from '@taiga-ui/cdk/constants';
import {tuiProvide} from '@taiga-ui/cdk/utils/di';

import {AbstractTuiTableFilter} from './abstract-table-filter';

@Directive({
    selector: '[tuiGenericFilter]',
    providers: [tuiProvide(AbstractTuiTableFilter, TuiGenericFilter)],
})
export class TuiGenericFilter<T, G> implements AbstractTuiTableFilter<T, G> {
    public readonly filter: Signal<(item: T, value: G) => boolean> = input<(item: T, value: G) => boolean>(TUI_TRUE_HANDLER, {
        alias: 'tuiGenericFilter',
    });
}
