import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    type DoCheck,
    inject,
    input,
    type OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgControl, NgModel} from '@angular/forms';
import {TuiNativeValidator} from '@taiga-ui/cdk/directives/native-validator';
import {tuiControlValue} from '@taiga-ui/cdk/observables';
import {tuiInjectElement} from '@taiga-ui/cdk/utils/dom';
import {tuiProvide} from '@taiga-ui/cdk/utils/di';
import {TuiAppearance, tuiAppearance} from '@taiga-ui/core/directives/appearance';
import {TuiIcons, tuiIconStart} from '@taiga-ui/core/directives/icons';
import {TUI_RADIO_OPTIONS} from '@taiga-ui/kit/components/radio';
import {distinctUntilChanged} from 'rxjs';

import {TUI_SWITCH_OPTIONS, type TuiSwitchOptions} from './switch.options';

@Component({
    selector: 'input[type="checkbox"][tuiSwitch]',
    template: '',
    styles: '@import "@taiga-ui/kit/styles/components/switch.less";',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [tuiProvide(TUI_RADIO_OPTIONS, TUI_SWITCH_OPTIONS)],
    hostDirectives: [
        {
            directive: TuiAppearance,
            inputs: ['tuiAppearanceState', 'tuiAppearanceFocus', 'tuiAppearanceMode'],
        },
        TuiNativeValidator,
        TuiIcons,
    ],
    host: {
        '[disabled]': '!control || control.disabled',
        '[attr.data-size]': 'size()',
        '[class._readonly]': '!control',
        switch: '',
        role: 'switch',
        '[class._native]': 'native',
    },
})

export class TuiSwitch implements DoCheck, OnInit {
    private readonly destroyRef = inject(DestroyRef);

    protected readonly el = tuiInjectElement<HTMLInputElement>();
    protected readonly options = inject<TuiSwitchOptions>(TUI_SWITCH_OPTIONS);
    protected readonly appearance = tuiAppearance(this.options.appearance(this.el));
    protected readonly control = inject(NgControl, {self: true, optional: true});

    protected readonly native = 'switch' in this.el;
    protected readonly icon = tuiIconStart(
        computed(() => (this.showIcons() ? this.options.icon(this.size()) : '')),
    );

    public readonly size = input(this.options.size);
    public readonly showIcons = input(this.options.showIcons);

    public ngOnInit(): void {
        tuiControlValue(this.control)
            .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => {
                const fix =
                    this.control instanceof NgModel && value == null
                        ? this.control.model
                        : value;

                this.el.indeterminate = fix == null && this.el.matches('[tuiCheckbox]');
                this.ngDoCheck();
            });
    }

    public ngDoCheck(): void {
        this.appearance.set(this.options.appearance(this.el));
    }
}
