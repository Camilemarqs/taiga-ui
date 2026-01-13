import {computed, Directive, inject, type Signal, signal, untracked} from '@angular/core';
import {type ControlValueAccessor, NgControl, NgModel} from '@angular/forms';
import {EMPTY_FUNCTION} from '@taiga-ui/cdk/constants';
import {tuiFallbackValueProvider, TUI_FALLBACK_VALUE} from '@taiga-ui/cdk/tokens';
import {tuiArrayToggle} from '@taiga-ui/cdk/utils/miscellaneous';

import {type TuiCheckboxRowDirective} from './checkbox-row.directive';

@Directive({
    selector: '[tuiTable][ngModel],[tuiTable][formControl],[tuiTable][formControlName]',
    providers: [tuiFallbackValueProvider([])],
})
export class TuiTableControlDirective<T> implements ControlValueAccessor {
    private readonly fallback = inject(TUI_FALLBACK_VALUE, {self: true, optional: true}) as readonly T[];
    private readonly control = inject(NgControl, {self: true});
    private readonly internal = signal<readonly T[]>(this.fallback || []);
    private readonly children = signal<ReadonlyArray<TuiCheckboxRowDirective<T>>>([]);

    public readonly value = computed(() => this.internal() ?? (this.fallback || []));

    public readonly checked: Signal<boolean> = computed(() => this.isAllChecked());

    public readonly indeterminate: Signal<boolean> = computed(() => this.hasIndeterminateState());

    public onChange: (value: readonly T[]) => void = EMPTY_FUNCTION;
    public onTouched = EMPTY_FUNCTION;

    constructor() {
        this.control.valueAccessor = this;
    }

    public toggleAll(): void {
        this.onChange(
            this.checked() ? [] : this.children().map((i) => i.tuiCheckboxRow()),
        );
    }

    public process(checkbox: TuiCheckboxRowDirective<T>): void {
        this.children.update((children) => tuiArrayToggle(children, checkbox));
    }

    public writeValue(value: readonly T[] | null): void {
        const safe = this.control instanceof NgModel ? this.control.model : value;
        this.internal.set((safe as readonly T[]) ?? this.fallback);
    }

    public registerOnChange(onChange: (value: unknown) => void): void {
        this.onChange = (value: readonly T[]) => {
            const internal = untracked(() => this.internal());

            if (value === internal) {
                return;
            }

            onChange(value);
            this.internal.set(value);
        };
    }

    public registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }

    public setDisabledState(): void {}

    private isAllChecked(): boolean {
        const childrenList = this.children();
        if (!childrenList.length) {
            return false;
        }
        const currentValue = this.value();
        return childrenList.every((item) => currentValue.includes(item.tuiCheckboxRow()));
    }

    private hasIndeterminateState(): boolean {
        return !!this.value().length && !this.checked();
    }
}
