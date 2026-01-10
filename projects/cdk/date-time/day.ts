/// <reference types="@taiga-ui/tsconfig/ng-dev-mode" />

import {tuiInRange, tuiNormalizeToIntNumber} from '@taiga-ui/cdk/utils/math';

import {DATE_FILLER_LENGTH} from './date-fillers';
import {MIN_DAY, MONTHS_IN_YEAR} from './date-time';
import {TuiDayOfWeek} from './day-of-week';
import {TuiMonth} from './month';
import {TuiMonthNumber} from './month-number';
import {type TuiDateMode, type TuiDayLike} from './types';
import {TuiYear} from './year';

export class TuiDay extends TuiMonth {
    /**
     * @param year
     * @param month (starting with 0)
     * @param day
     */
    constructor(
        year: number,
        month: number,
        public readonly day: number,
    ) {
        super(year, month);
        ngDevMode && console.assert(TuiDay.isValidDay(year, month, day));
    }

    public static fromLocalNativeDate(date: Date): TuiDay {
        return new TuiDay(date.getFullYear(), date.getMonth(), date.getDate());
    }

    public static fromUtcNativeDate(date: Date): TuiDay {
        return new TuiDay(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    }

    public static isValidDay(year: number, month: number, day: number): boolean {
        return (
            TuiMonth.isValidMonth(year, month) &&
            Number.isInteger(day) &&
            tuiInRange(
                day,
                MIN_DAY,
                TuiMonth.getMonthDaysCount(month, TuiYear.isLeapYear(year)) + 1,
            )
        );
    }

    public static override currentLocal(): TuiDay {
        const nativeDate = new Date();
        const year = nativeDate.getFullYear();
        const month = nativeDate.getMonth();
        const day = nativeDate.getDate();

        return new TuiDay(year, month, day);
    }

    public static override currentUtc(): TuiDay {
        const nativeDate = new Date();
        const year = nativeDate.getUTCFullYear();
        const month = nativeDate.getUTCMonth();
        const day = nativeDate.getUTCDate();

        return new TuiDay(year, month, day);
    }

    public static normalizeOf(year: number, month: number, day: number): TuiDay {
        const normalizedYear = TuiYear.normalizeYearPart(year);
        const normalizedMonth = TuiMonth.normalizeMonthPart(month);
        const normalizedDay = TuiDay.normalizeDayPart(
            day,
            normalizedMonth,
            normalizedYear,
        );

        return new TuiDay(normalizedYear, normalizedMonth, normalizedDay);
    }

    public static override lengthBetween(from: TuiDay, to: TuiDay): number {
        return Math.round(
            (to.toLocalNativeDate().getTime() - from.toLocalNativeDate().getTime()) /
                (1000 * 60 * 60 * 24),
        );
    }

    public static parseRawDateString(
        date: string,
        dateMode: TuiDateMode = 'dd/mm/yyyy',
    ): {day: number; month: number; year: number} {
        ngDevMode &&
            console.assert(
                date.length === DATE_FILLER_LENGTH,
                '[parseRawDateString]: wrong date string length',
            );

        switch (dateMode) {
            case 'mm/dd/yyyy':
                return TuiDay.parseMmDdYyyy(date);
            case 'yyyy/mm/dd':
                return TuiDay.parseYyyyMmDd(date);
            case 'dd/mm/yyyy':
            default:
                return TuiDay.parseDdMmYyyy(date);
        }
    }

    private static parseMmDdYyyy(date: string): {
        day: number;
        month: number;
        year: number;
    } {
        return {
            day: parseInt(date.slice(3, 5), 10),
            month: parseInt(date.slice(0, 2), 10) - 1,
            year: parseInt(date.slice(6, 10), 10),
        };
    }

    private static parseYyyyMmDd(date: string): {
        day: number;
        month: number;
        year: number;
    } {
        return {
            day: parseInt(date.slice(8, 10), 10),
            month: parseInt(date.slice(5, 7), 10) - 1,
            year: parseInt(date.slice(0, 4), 10),
        };
    }

    private static parseDdMmYyyy(date: string): {
        day: number;
        month: number;
        year: number;
    } {
        return {
            day: parseInt(date.slice(0, 2), 10),
            month: parseInt(date.slice(3, 5), 10) - 1,
            year: parseInt(date.slice(6, 10), 10),
        };
    }

    public static normalizeParse(
        rawDate: string,
        dateMode: TuiDateMode = 'dd/mm/yyyy',
    ): TuiDay {
        const {day, month, year} = this.parseRawDateString(rawDate, dateMode);

        return TuiDay.normalizeOf(year, month, day);
    }

    public static jsonParse(ymdString: string): TuiDay {
        const {day, month, year} = this.parseRawDateString(ymdString, 'yyyy/mm/dd');

        if (!TuiDay.isValidParsedDay(day, month, year)) {
            throw new TuiInvalidDayException(year, month, day);
        }

        return new TuiDay(year, month, day);
    }

    private static isValidParsedDay(day: number, month: number, year: number): boolean {
        return (
            TuiMonth.isValidMonth(year, month) &&
            Number.isInteger(day) &&
            tuiInRange(
                day,
                MIN_DAY,
                TuiMonth.getMonthDaysCount(month, TuiYear.isLeapYear(year)) + 1,
            )
        );
    }

    public static normalizeDayPart(day: number, month: number, year: number): number {
        ngDevMode && console.assert(TuiMonth.isValidMonth(year, month));

        const monthDaysCount = TuiMonth.getMonthDaysCount(
            month,
            TuiYear.isLeapYear(year),
        );

        return tuiNormalizeToIntNumber(day, 1, monthDaysCount);
    }

    public get formattedDayPart(): string {
        return String(this.day).padStart(2, '0');
    }

    public get isWeekend(): boolean {
        const dayOfWeek = this.dayOfWeek(false);

        return dayOfWeek === TuiDayOfWeek.Saturday || dayOfWeek === TuiDayOfWeek.Sunday;
    }

    public dayOfWeek(startFromMonday = true): number {
        const dayOfWeek = startFromMonday
            ? this.toLocalNativeDate().getDay() - 1
            : this.toLocalNativeDate().getDay();

        return dayOfWeek < 0 ? 6 : dayOfWeek;
    }

    public dayBefore(another: TuiDay): boolean {
        return (
            this.monthBefore(another) ||
            (this.monthSame(another) && this.day < another.day)
        );
    }

    public daySameOrBefore(another: TuiDay): boolean {
        return (
            this.monthBefore(another) ||
            (this.monthSame(another) && this.day <= another.day)
        );
    }

    public daySame(another: TuiDay): boolean {
        return this.monthSame(another) && this.day === another.day;
    }

    public daySameOrAfter(another: TuiDay): boolean {
        return (
            this.monthAfter(another) ||
            (this.monthSame(another) && this.day >= another.day)
        );
    }

    public dayAfter(another: TuiDay): boolean {
        return (
            this.monthAfter(another) ||
            (this.monthSame(another) && this.day > another.day)
        );
    }

    public dayLimit(min: TuiDay | null, max: TuiDay | null): TuiDay {
        if (min !== null && this.dayBefore(min)) {
            return min;
        }

        if (max !== null && this.dayAfter(max)) {
            return max;
        }

        return this;
    }

    public override append({year = 0, month = 0, day = 0}: TuiDayLike): TuiDay {
        const {years, months} = this.calculateInitialMonthsAndYears(year, month);
        const days = this.calculateInitialDays(day, years, months);
        const adjustedDaysOver = this.adjustDaysOverLimit(days, years, months);

        return this.adjustDaysUnderLimit(
            adjustedDaysOver.days,
            adjustedDaysOver.years,
            adjustedDaysOver.months,
        );
    }

    private calculateInitialMonthsAndYears(
        yearOffset: number,
        monthOffset: number,
    ): {years: number; months: number} {
        const totalMonths =
            (this.year + yearOffset) * MONTHS_IN_YEAR + this.month + monthOffset;
        const years = Math.floor(totalMonths / MONTHS_IN_YEAR);
        const months = totalMonths % MONTHS_IN_YEAR;

        return {years, months};
    }

    private calculateInitialDays(
        dayOffset: number,
        targetYear: number,
        targetMonth: number,
    ): number {
        const monthDaysCount = TuiMonth.getMonthDaysCount(
            targetMonth,
            TuiYear.isLeapYear(targetYear),
        );
        const currentMonthDaysCount = TuiMonth.getMonthDaysCount(
            this.month,
            TuiYear.isLeapYear(targetYear),
        );

        if (this.day >= monthDaysCount) {
            return dayOffset + this.day - (currentMonthDaysCount - monthDaysCount);
        }

        if (
            currentMonthDaysCount < monthDaysCount &&
            this.day === currentMonthDaysCount
        ) {
            return dayOffset + this.day + (monthDaysCount - currentMonthDaysCount);
        }

        return dayOffset + this.day;
    }

    private adjustDaysOverLimit(
        days: number,
        years: number,
        months: number,
    ): {days: number; years: number; months: number} {
        let adjustedDays = days;
        let adjustedYears = years;
        let adjustedMonths = months;

        while (
            adjustedDays >
            TuiMonth.getMonthDaysCount(adjustedMonths, TuiYear.isLeapYear(adjustedYears))
        ) {
            adjustedDays -= TuiMonth.getMonthDaysCount(
                adjustedMonths,
                TuiYear.isLeapYear(adjustedYears),
            );

            if (adjustedMonths === TuiMonthNumber.December) {
                adjustedYears++;
                adjustedMonths = TuiMonthNumber.January;
            } else {
                adjustedMonths++;
            }
        }

        return {days: adjustedDays, years: adjustedYears, months: adjustedMonths};
    }

    private adjustDaysUnderLimit(days: number, years: number, months: number): TuiDay {
        let adjustedDays = days;
        let adjustedYears = years;
        let adjustedMonths = months;

        while (adjustedDays < MIN_DAY) {
            if (adjustedMonths === TuiMonthNumber.January) {
                adjustedYears--;
                adjustedMonths = TuiMonthNumber.December;
            } else {
                adjustedMonths--;
            }

            adjustedDays += TuiMonth.getMonthDaysCount(
                adjustedMonths,
                TuiYear.isLeapYear(adjustedYears),
            );
        }

        return new TuiDay(adjustedYears, adjustedMonths, adjustedDays);
    }

    public getFormattedDay(dateFormat: TuiDateMode, separator: string): string {
        ngDevMode &&
            console.assert(
                separator.length === 1,
                'Separator should consist of only 1 symbol',
            );

        const dd = this.formattedDayPart;
        const mm = this.formattedMonthPart;
        const yyyy = this.formattedYear;

        switch (dateFormat) {
            case 'mm/dd/yyyy':
                return this.formatMmDdYyyy(mm, dd, yyyy, separator);
            case 'yyyy/mm/dd':
                return this.formatYyyyMmDd(mm, dd, yyyy, separator);
            case 'dd/mm/yyyy':
            default:
                return this.formatDdMmYyyy(mm, dd, yyyy, separator);
        }
    }

    private formatMmDdYyyy(
        mm: string,
        dd: string,
        yyyy: string,
        separator: string,
    ): string {
        return `${mm}${separator}${dd}${separator}${yyyy}`;
    }

    private formatYyyyMmDd(
        mm: string,
        dd: string,
        yyyy: string,
        separator: string,
    ): string {
        return `${yyyy}${separator}${mm}${separator}${dd}`;
    }

    private formatDdMmYyyy(
        mm: string,
        dd: string,
        yyyy: string,
        separator: string,
    ): string {
        return `${dd}${separator}${mm}${separator}${yyyy}`;
    }

    public override toString(
        dateFormat: TuiDateMode = 'dd/mm/yyyy',
        separator = '.',
    ): string {
        return this.getFormattedDay(dateFormat, separator);
    }

    public override toJSON(): string {
        return `${super.toJSON()}-${this.formattedDayPart}`;
    }

    public override toLocalNativeDate(): Date {
        const date = super.toLocalNativeDate();

        date.setDate(this.day);

        return date;
    }

    public override toUtcNativeDate(): Date {
        return new Date(Date.UTC(this.year, this.month, this.day));
    }
}

export class TuiInvalidDayException extends Error {
    constructor(year: number, month: number, day: number) {
        super(ngDevMode ? `Invalid day: ${year}-${month}-${day}` : '');
    }
}
