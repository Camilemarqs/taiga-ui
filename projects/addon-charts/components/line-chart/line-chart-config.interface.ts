import {type TuiStringHandler} from '@taiga-ui/cdk/types';
import {type TuiPoint} from '@taiga-ui/core/types';

/**
 * Configuração de dimensões e posicionamento do gráfico
 */
export interface TuiChartDimensionsConfig {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

/**
 * Configuração de estilo e aparência do gráfico
 */
export interface TuiChartStylingConfig {
    readonly smoothingFactor: number;
    readonly filled: boolean;
    readonly dots: boolean;
}

/**
 * Configuração de formatação de valores (hints)
 */
export interface TuiChartFormattingConfig {
    readonly xStringify: TuiStringHandler<number> | null;
    readonly yStringify: TuiStringHandler<number> | null;
}

/**
 * Configuração de dados do gráfico
 */
export interface TuiChartDataConfig {
    readonly value: readonly TuiPoint[];
}
