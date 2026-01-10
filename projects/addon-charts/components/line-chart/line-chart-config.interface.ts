import {type TuiStringHandler} from '@taiga-ui/cdk/types';
import {type TuiPoint} from '@taiga-ui/core/types';

export interface TuiChartDimensionsConfig {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export interface TuiChartStylingConfig {
    readonly smoothingFactor: number;
    readonly filled: boolean;
    readonly dots: boolean;
}

export interface TuiChartFormattingConfig {
    readonly xStringify: TuiStringHandler<number> | null;
    readonly yStringify: TuiStringHandler<number> | null;
}

export interface TuiChartDataConfig {
    readonly value: readonly TuiPoint[];
}
