import {type TuiContext, type TuiStringHandler} from '@taiga-ui/cdk/types';
import {TuiDay} from '@taiga-ui/cdk/date-time';
import {type PolymorpheusContent} from '@taiga-ui/polymorpheus';

export interface TuiLineDaysChartDimensionsConfig {
    readonly y: number;
    readonly height: number;
}

export interface TuiLineDaysChartStylingConfig {
    readonly smoothingFactor: number;
    readonly dots: boolean;
}

export interface TuiLineDaysChartFormattingConfig {
    readonly xStringify: TuiStringHandler<TuiDay> | null;
    readonly yStringify: TuiStringHandler<number> | null;
    readonly hintContent: PolymorpheusContent<TuiContext<[TuiDay, number]>> | undefined;
}

export interface TuiLineDaysChartDataConfig {
    readonly value: ReadonlyArray<[TuiDay, number]>;
}
