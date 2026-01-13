import {AsyncPipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    ElementRef,
    forwardRef,
    inject,
    input,
    signal,
    TemplateRef,
    type Signal,
    ViewEncapsulation,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgControl} from '@angular/forms';
import {WaResizeObserver} from '@ng-web-apis/resize-observer';
import {TuiControl} from '@taiga-ui/cdk/classes';
import {TuiItem} from '@taiga-ui/cdk/directives/item';
import {type TuiContext} from '@taiga-ui/cdk/types';
import {tuiZonefree} from '@taiga-ui/cdk/observables';
import {tuiInjectElement, tuiIsElement, tuiValue} from '@taiga-ui/cdk/utils/dom';
import {tuiFocusedIn} from '@taiga-ui/cdk/utils/focus';
import {tuiArrayToggle, tuiGenerateId, tuiPx} from '@taiga-ui/cdk/utils/miscellaneous';
import {tuiProvide} from '@taiga-ui/cdk/utils/di';
import {tuiButtonOptionsProvider} from '@taiga-ui/core/components/button';
import {tuiAsDataListHost, type TuiDataListHost} from '@taiga-ui/core/components/data-list';
import {TuiLabel} from '@taiga-ui/core/components/label';
import {TUI_SCROLL_REF, TuiScrollControls} from '@taiga-ui/core/components/scrollbar';
import {TuiButtonX} from '@taiga-ui/core/directives/button-x';
import {TUI_ITEMS_HANDLERS} from '@taiga-ui/core/directives/items-handlers';
import {
    TuiDropdownDirective,
    TuiDropdownOpen,
} from '@taiga-ui/core/portals/dropdown';
import {TUI_CLEAR_WORD, TUI_TEXTFIELD_OPTIONS} from '@taiga-ui/core/tokens';
import {type TuiSizeL, type TuiSizeS} from '@taiga-ui/core/types';
import {type PolymorpheusContent, PolymorpheusOutlet} from '@taiga-ui/polymorpheus';
import {filter, fromEvent} from 'rxjs';

import {TuiTextfieldComponent} from '../textfield.component';
import {TUI_TEXTFIELD_ACCESSOR, type TuiTextfieldAccessor} from '../textfield-accessor';
import {TUI_TEXTFIELD_ITEM} from './textfield-item.component';

@Component({
    selector: 'tui-textfield[multi]',
    imports: [
        AsyncPipe,
        PolymorpheusOutlet,
        TuiButtonX,
        TuiScrollControls,
        WaResizeObserver,
    ],
    templateUrl: './textfield-multi.template.html',
    styleUrl: './textfield-multi.style.less',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        tuiButtonOptionsProvider({size: 'xs', appearance: 'icon'}),
        tuiAsDataListHost(TuiTextfieldMultiComponent),
        tuiProvide(TuiTextfieldComponent, TuiTextfieldMultiComponent),
        tuiProvide(TUI_SCROLL_REF, ElementRef),
    ],
    host: {
        '[attr.data-state]': 'control()?.disabled ? "disabled" : null',
        '[class._empty]': '!control()?.value?.length',
        '[style.--t-item-height.px]': 'height()',
        '[style.--t-rows]': 'rows()',
        '(click.prevent)': 'onClick($event.target)',
        '(tuiActiveZoneChange)': '!$event && el.scrollTo({left: 0})',
    },
})
export class TuiTextfieldMultiComponent<T> implements TuiDataListHost<T> {
    private readonly autoId = tuiGenerateId();
    private readonly focusedIn = tuiFocusedIn(tuiInjectElement());

    protected readonly height = signal<number | null>(null);
    protected readonly handlers = inject(TUI_ITEMS_HANDLERS);
    protected readonly component = TUI_TEXTFIELD_ITEM;
    protected readonly dropdown = inject(TuiDropdownDirective);
    protected readonly open = inject(TuiDropdownOpen);
    protected readonly clear = inject(TUI_CLEAR_WORD);
    protected readonly label = contentChild(
        forwardRef(() => TuiLabel),
        {read: ElementRef},
    );
    protected readonly computedFiller = computed((value = this.value()) => {
        const filler = value + this.filler().slice(value.length);
        return filler.length > value.length ? filler : '';
    });
    protected readonly showFiller = computed<boolean>(
        () =>
            this.focused() &&
            !!this.computedFiller() &&
            (!!this.value() || !this.input()?.nativeElement.placeholder),
    );
    protected readonly accessor = contentChild<TuiTextfieldAccessor<T>>(
        TUI_TEXTFIELD_ACCESSOR,
        {descendants: true},
    );
    protected readonly sub = fromEvent(this.el, 'scroll')
        .pipe(
            filter(() => this.rows() === 1),
            tuiZonefree(),
            takeUntilDestroyed(),
        )
        .subscribe(() => {
            this.el.style.setProperty('--t-scroll', tuiPx(-1 * this.el.scrollLeft));
        });

    public readonly control = contentChild(NgControl);
    public readonly el = tuiInjectElement();
    public readonly input: Signal<ElementRef<HTMLInputElement> | undefined> =
        contentChild(TUI_TEXTFIELD_ACCESSOR, {read: ElementRef});
    public readonly content = input<PolymorpheusContent<TuiContext<T>>>();
    public readonly filler = input('');
    public readonly value = tuiValue(this.input);
    public readonly options = inject(TUI_TEXTFIELD_OPTIONS);
    public readonly focused = computed(() => this.open.open() || this.focusedIn());
    public readonly cva = contentChild(TuiControl);
    public readonly item = contentChild(TuiItem, {read: TemplateRef, descendants: true});
    public readonly rows = input(100);

    public get size(): TuiSizeL | TuiSizeS {
        return this.options.size();
    }

    public handleOption(option: T): void {
        this.accessor()?.setValue(
            tuiArrayToggle(
                this.control()?.value ?? [],
                option,
                this.handlers.identityMatcher(),
            ),
        );
    }

    protected get placeholder(): string {
        const el = this.input()?.nativeElement;
        const placeholder = el?.matches('input') ? el.placeholder : this.computedFiller();
        const value = this.computedFiller() || this.value();
        const longer = value.length > placeholder.length ? value : placeholder;

        return this.focused() ? longer : '';
    }

    protected onItems({target}: ResizeObserverEntry): void {
        const height =
            this.rows() > 1 && this.control()?.value?.length
                ? (target.querySelector('tui-textfield-item')?.clientHeight ?? 0)
                : null;

        if (height !== 0) {
            this.height.set(height);
        }
    }

    protected onResize({contentRect}: ResizeObserverEntry): void {
        this.el.style.setProperty('--t-side', tuiPx(contentRect.width));
    }

    protected onLeft(event: any): void {
        if (this.value() || !tuiIsElement(event.currentTarget)) {
            return;
        }

        event.preventDefault();
        event.currentTarget.previousElementSibling?.firstElementChild?.focus();
    }

    protected onClick(target: HTMLElement): void {
        if (
            target === this.el ||
            !this.cva()?.interactive() ||
            (!this.el.matches('[tuiChevron]') &&
                !this.el.querySelector('select, [tuiInputDateMulti]')) ||
            target.matches('input:read-only,input[inputmode="none"]')
        ) {
            return;
        }

        this.open.open.update((open) => !open);

        try {
            this.input()?.nativeElement.showPicker?.();
        } catch {
        }
    }
}
