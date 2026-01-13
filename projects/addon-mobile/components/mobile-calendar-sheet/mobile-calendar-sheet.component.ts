import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {TUI_FALSE_HANDLER} from '@taiga-ui/cdk/constants';
import {TuiDay, TuiDayRange, TuiMonth} from '@taiga-ui/cdk/date-time';
import {type TuiBooleanHandler} from '@taiga-ui/cdk/types';
import {WA_IS_IOS} from '@ng-web-apis/platform';
import {TuiRipple} from '@taiga-ui/addon-mobile/directives/ripple';
import {TuiCalendarSheetPipe} from '@taiga-ui/core/components/calendar';
import {TUI_CALENDAR_SHEET_OPTIONS} from '@taiga-ui/core/components/calendar/calendar-sheet.options';

@Component({
    selector: 'tui-mobile-calendar-sheet',
    imports: [TuiCalendarSheetPipe, TuiRipple],
    templateUrl: './mobile-calendar-sheet.template.html',
    styleUrl: './mobile-calendar-sheet.style.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class._ios]': 'isIOS',
    },
})
export class TuiMobileCalendarSheet {
    private readonly options = inject(TUI_CALENDAR_SHEET_OPTIONS);
    private readonly today = TuiDay.currentLocal();

    protected readonly isIOS = inject(WA_IS_IOS);

    @Input()
    public month: TuiMonth = TuiMonth.currentLocal();

    @Input()
    public disabledItemHandler: TuiBooleanHandler<TuiDay> = TUI_FALSE_HANDLER;

    @Input()
    public value: TuiDay | TuiDayRange | readonly TuiDay[] | null = null;

    @Input()
    public hoveredItem: TuiDay | null = null;

    @Input()
    public single = true;

    @Output()
    public readonly dayClick = new EventEmitter<TuiDay>();

    public getItemRange(item: TuiDay): 'active' | 'end' | 'middle' | 'start' | null {
        const {value, hoveredItem} = this;

        if (!value) {
            return null;
        }

        if (value instanceof TuiDay && !this.computedRangeMode) {
            return value.daySame(item) ? 'active' : null;
        }

        if (value instanceof TuiDayRange && value.isSingleDay) {
            return value.from.daySame(item) ? 'active' : null;
        }

        if (!(value instanceof TuiDay) && !(value instanceof TuiDayRange)) {
            return value.find((day) => day.daySame(item)) ? 'active' : null;
        }

        const range = this.getRange(value, hoveredItem);

        if (range.isSingleDay && range.from.daySame(item)) {
            return 'active';
        }

        if (range.from.daySame(item)) {
            return 'start';
        }

        if (range.to.daySame(item)) {
            return 'end';
        }

        return range.from.dayBefore(item) && range.to.dayAfter(item) ? 'middle' : null;
    }

    protected itemIsToday(item: TuiDay): boolean {
        return this.today.daySame(item);
    }

    public onItemClick(item: TuiDay): void {
        this.dayClick.emit(item);
    }

    protected get computedRangeMode(): boolean {
        return !this.single || this.options.rangeMode;
    }

    private getRange(
        value: TuiDay | TuiDayRange,
        hoveredItem: TuiDay | null,
    ): TuiDayRange {
        if (value instanceof TuiDay) {
            return TuiDayRange.sort(value, hoveredItem ?? value);
        }

        return value.isSingleDay
            ? TuiDayRange.sort(value.from, hoveredItem ?? value.to)
            : value;
    }
}
