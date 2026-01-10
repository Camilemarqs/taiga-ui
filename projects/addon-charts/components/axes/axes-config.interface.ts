import {type TuiLineHandler} from '@taiga-ui/addon-charts/types';

export interface TuiAxisXConfig {
    readonly labels: ReadonlyArray<string | null>;
    readonly centered: boolean;
}

export interface TuiAxisYConfig {
    readonly labels: readonly string[];
    readonly name: string;
    readonly inset: boolean;
}

export interface TuiGridConfig {
    readonly horizontalLines: number;
    readonly horizontalLinesHandler: TuiLineHandler;
    readonly verticalLines: number;
    readonly verticalLinesHandler: TuiLineHandler;
}
