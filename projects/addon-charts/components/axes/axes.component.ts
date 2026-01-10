import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {type TuiLineHandler} from '@taiga-ui/addon-charts/types';
import {CHAR_NO_BREAK_SPACE} from '@taiga-ui/cdk/constants';
import {
    type TuiAxisXConfig,
    type TuiAxisYConfig,
    type TuiGridConfig,
} from './axes-config.interface';

export const TUI_ALWAYS_DASHED: TuiLineHandler = (index) =>
    (index && 'dashed') || 'solid';
export const TUI_ALWAYS_DOTTED: TuiLineHandler = (index) =>
    (index && 'dotted') || 'solid';
export const TUI_ALWAYS_SOLID: TuiLineHandler = () => 'solid';
export const TUI_ALWAYS_NONE: TuiLineHandler = () => 'none';

@Component({
    selector: 'tui-axes',
    templateUrl: './axes.template.html',
    styleUrl: './axes.style.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        dir: 'ltr',
        '[class._centered]': 'centeredXLabels()',
    },
})
export class TuiAxes {
    // INPUTS - Agrupados por responsabilidade para melhor organização

    public readonly axisXLabels = input<ReadonlyArray<string | null>>([]);
    public readonly centeredXLabels = input(false);

    public readonly axisYLabels = input<readonly string[]>([]);
    public readonly axisYName = input('');
    public readonly axisYInset = input(false);

    public readonly axisYSecondaryLabels = input<readonly string[]>([]);
    public readonly axisYSecondaryName = input('');
    public readonly axisYSecondaryInset = input(false);

    public readonly horizontalLines = input(1);
    public readonly horizontalLinesHandler = input<TuiLineHandler>(TUI_ALWAYS_SOLID);
    public readonly verticalLines = input(1);
    public readonly verticalLinesHandler = input<TuiLineHandler>(TUI_ALWAYS_DASHED);

    // CONSTANTES
    public readonly fallbackLabel = CHAR_NO_BREAK_SPACE;

    // CONFIGURAÇÕES AGRUPADAS - Agrega inputs relacionados para lógica interna

    private readonly axisXConfig = computed<TuiAxisXConfig>(() => ({
        labels: this.axisXLabels(),
        centered: this.centeredXLabels(),
    }));

    private readonly axisYConfig = computed<TuiAxisYConfig>(() => ({
        labels: this.axisYLabels(),
        name: this.axisYName(),
        inset: this.axisYInset(),
    }));

    private readonly axisYSecondaryConfig = computed<TuiAxisYConfig>(() => ({
        labels: this.axisYSecondaryLabels(),
        name: this.axisYSecondaryName(),
        inset: this.axisYSecondaryInset(),
    }));

    private readonly gridConfig = computed<TuiGridConfig>(() => ({
        horizontalLines: this.horizontalLines(),
        horizontalLinesHandler: this.horizontalLinesHandler(),
        verticalLines: this.verticalLines(),
        verticalLinesHandler: this.verticalLinesHandler(),
    }));

    // COMPUTED VALUES - Lógica de validação agrupada por responsabilidade

    public readonly hasXLabels = computed(() => !!this.axisXConfig().labels.length);

    public readonly hasYLabels = computed(
        () =>
            (this.axisYConfig().labels.length && !this.axisYConfig().inset) ||
            !!this.axisYConfig().name,
    );

    public readonly hasYSecondaryLabels = computed(
        () =>
            (this.axisYSecondaryConfig().labels.length &&
                !this.axisYSecondaryConfig().inset) ||
            !!this.axisYSecondaryConfig().name,
    );
}
