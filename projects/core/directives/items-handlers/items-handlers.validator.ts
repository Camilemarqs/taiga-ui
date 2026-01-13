import {Directive, effect, inject} from '@angular/core';
import {NG_VALIDATORS, type Validator, type ValidatorFn} from '@angular/forms';
import {EMPTY_FUNCTION} from '@taiga-ui/cdk/constants';
import {type TuiBooleanHandler} from '@taiga-ui/cdk/types';
import {tuiProvide} from '@taiga-ui/cdk/utils/di';

import {TuiItemsHandlersDirective} from './items-handlers.directive';

@Directive({
    providers: [tuiProvide(NG_VALIDATORS, TuiItemsHandlersValidator, true)],
})
export class TuiItemsHandlersValidator implements Validator {
    private readonly handlers = inject(TuiItemsHandlersDirective);
    protected onChange = EMPTY_FUNCTION;

    protected readonly update = effect(() => {
        this.handlers.disabledItemHandler();
        this.onChange();
    });

    public disabledItemHandler: TuiBooleanHandler<any> = (value) =>
        Array.isArray(value)
            ? value.some((item) => this.handlers.disabledItemHandler()(item))
            : Boolean(value) && this.handlers.disabledItemHandler()(value);

    public validate: ValidatorFn = ({value}) =>
        this.disabledItemHandler(value) ? {tuiDisabledItem: value} : null;

    public registerOnValidatorChange(onChange: (...args: any[]) => void): void {
        this.onChange = onChange;
    }
}
