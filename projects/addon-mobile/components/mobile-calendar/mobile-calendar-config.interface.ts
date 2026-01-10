import {TuiDay, TuiDayRange} from '@taiga-ui/cdk/date-time';
import {type TuiBooleanHandler} from '@taiga-ui/cdk/types';

export interface TuiMobileCalendarMainConfig {
    readonly single: boolean;
    readonly multi: boolean;
    readonly min: TuiDay;
    readonly max: TuiDay;
    readonly disabledItemHandler: TuiBooleanHandler<TuiDay>;
}

export interface TuiMobileCalendarStateConfig {
    readonly activeYear: number;
    readonly activeMonth: number;
    readonly initialized: boolean;
}

export interface TuiMobileCalendarValueConfig {
    readonly value: TuiDay | TuiDayRange | readonly TuiDay[] | null;
    readonly initialYear: number;
    readonly initialMonth: number;
}
