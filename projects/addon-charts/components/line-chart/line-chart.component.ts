import {AsyncPipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    signal,
    viewChildren,
} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {WaResizeObserverService} from '@ng-web-apis/resize-observer';
import {TuiChartHint} from '@taiga-ui/addon-charts/components/chart-hint';
import {type TuiLineChartHintContext} from '@taiga-ui/addon-charts/types';
import {tuiDraw} from '@taiga-ui/addon-charts/utils';
import {type TuiStringHandler} from '@taiga-ui/cdk/types';
import {tuiGenerateId, tuiIsPresent} from '@taiga-ui/cdk/utils/miscellaneous';
import {TuiHint, TuiHintHover, tuiHintOptionsProvider} from '@taiga-ui/core/portals/hint';
import {type TuiPoint} from '@taiga-ui/core/types';
import {type PolymorpheusContent} from '@taiga-ui/polymorpheus';
import {filter, map} from 'rxjs';

import {TUI_LINE_CHART_OPTIONS} from './line-chart.options';
import {TuiLineChartHint} from './line-chart-hint.directive';
import {
    type TuiChartDataConfig,
    type TuiChartDimensionsConfig,
    type TuiChartFormattingConfig,
    type TuiChartStylingConfig,
} from './line-chart-config.interface';

@Component({
    selector: 'tui-line-chart',
    imports: [AsyncPipe, TuiHint],
    templateUrl: './line-chart.template.html',
    styleUrl: './line-chart.style.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [WaResizeObserverService],
    viewProviders: [tuiHintOptionsProvider({direction: 'top', hideDelay: 0})],
    host: {
        '(mouseleave)': 'onMouseLeave()',
    },
})
export class TuiLineChart {
    // SERVIÇOS E DEPENDÊNCIAS INJETADAS
    private readonly options = inject(TUI_LINE_CHART_OPTIONS);
    private readonly autoId = tuiGenerateId();
    private readonly resize = toSignal(
        inject(WaResizeObserverService, {self: true}).pipe(
            map(([e]) => e?.contentRect.height || NaN),
            filter((height) => !Number.isNaN(height)),
        ),
        {initialValue: NaN},
    );
    protected readonly hintDirective = inject(TuiLineChartHint, {optional: true});
    protected readonly hintOptions = inject(TuiChartHint, {optional: true});

    // INPUTS - Agrupados por responsabilidade

    // Dimensões e posicionamento
    public readonly x = input(0);
    public readonly y = input(0);
    public readonly width = input(0);
    public readonly height = input(0);

    // Estilo e aparência
    public readonly smoothingFactor = input(this.options.smoothingFactor);
    public readonly filled = input(this.options.filled);
    public readonly dots = input(this.options.dots);

    // Formatação de valores (hints)
    public xStringify = input<TuiStringHandler<number> | null>(null);
    public yStringify = input<TuiStringHandler<number> | null>(null);

    // Dados do gráfico
    public value = input<readonly TuiPoint[], readonly TuiPoint[]>([], {
        transform: (value) => value.filter((item) => !item.some(Number.isNaN)),
    });

    // ESTADO E INTERAÇÃO
    public readonly hovered = signal<number>(NaN);
    public readonly drivers = viewChildren(TuiHintHover);
    public readonly drivers$ = toObservable(this.drivers);

    // CONFIGURAÇÕES AGRUPADAS - Agrega inputs relacionados para lógica interna

    /** Configuração de dimensões agrupada */
    private readonly dimensionsConfig = computed<TuiChartDimensionsConfig>(() => ({
        x: this.x(),
        y: this.y(),
        width: this.width(),
        height: this.height(),
    }));

    /** Configuração de estilo agrupada */
    private readonly stylingConfig = computed<TuiChartStylingConfig>(() => ({
        smoothingFactor: this.smoothingFactor(),
        filled: this.filled(),
        dots: this.dots(),
    }));

    /** Configuração de formatação agrupada */
    private readonly formattingConfig = computed<TuiChartFormattingConfig>(() => ({
        xStringify: this.xStringify(),
        yStringify: this.yStringify(),
    }));

    /** Configuração de dados agrupada */
    private readonly dataConfig = computed<TuiChartDataConfig>(() => ({
        value: this.value(),
    }));

    // COMPUTED VALUES - SVG e cálculos de renderização

    private readonly box = computed(
        () =>
            `${this.dimensionsConfig().x} ${this.dimensionsConfig().y} ${this.dimensionsConfig().width} ${this.dimensionsConfig().height}`,
    );

    protected readonly viewBox = computed(() => {
        if (Number.isNaN(this.resize())) {
            return '0 0 0 0';
        }

        const {height} = this.dimensionsConfig();
        const offset = height / Math.max(this.resize(), 1);
        const [x = 0, y = 0, width = 0, heightValue = 0] = this.box()
            .split(' ')
            .map(Number);

        return `${x} ${y - offset} ${width} ${heightValue + 2 * offset}`;
    });

    protected readonly d = computed(() => {
        const {value} = this.dataConfig();
        const {smoothingFactor} = this.stylingConfig();

        return value.reduce(
            (d, point, index) =>
                index ? `${d} ${tuiDraw(value, index, smoothingFactor)}` : `M ${point}`,
            '',
        );
    });

    protected readonly fillD = computed(() => {
        const {value} = this.dataConfig();
        const {y} = this.dimensionsConfig();

        return value.length
            ? `${this.d()}V ${y} H ${value[0]?.[0]} V ${value[0]?.[1]}`
            : this.d();
    });

    // GETTERS E PROPRIEDADES COMPUTED - Acessórios e helpers

    protected get hintContent(): PolymorpheusContent<TuiLineChartHintContext<TuiPoint>> {
        return this.hintOptions?.content() || '';
    }

    protected get fillId(): string {
        return `tui-line-chart-${this.autoId}`;
    }

    protected get fill(): string {
        return this.stylingConfig().filled ? `url(#${this.fillId})` : 'none';
    }

    protected get hasHints(): boolean {
        const {xStringify, yStringify} = this.formattingConfig();
        return (
            !!xStringify ||
            !!yStringify ||
            !!this.hintDirective?.hint() ||
            !!this.hintContent
        );
    }

    protected get isFocusable(): boolean {
        return !this.hintDirective && this.hasHints;
    }

    private get isSinglePoint(): boolean {
        return this.dataConfig().value.length === 1;
    }

    // MÉTODOS DE INTERAÇÃO - Hover e eventos do mouse

    public onHovered(index: number): void {
        this.hovered.set(index);
    }

    protected onMouseLeave(): void {
        if (!this.hintDirective) {
            this.onHovered(NaN);
        }
    }

    protected onMouseEnter(index: number): void {
        if (this.hintDirective) {
            this.hintDirective.raise(index, this);
        } else {
            this.onHovered(index);
        }
    }

    // MÉTODOS DE CÁLCULO GEOMÉTRICO - Posicionamento e dimensões

    protected getX(index: number): number {
        const {value} = this.dataConfig();

        if (this.isSinglePoint) {
            return (value[0]?.[0] || 0) / 2;
        }

        return index
            ? ((value[index - 1]?.[0] || 0) + (value[index]?.[0] || 0)) / 2
            : 2 * (value[0]?.[0] || 0) - this.getX(1);
    }

    protected getWidth(index: number): number {
        const {width} = this.dimensionsConfig();
        return (100 * this.computeWidth(index)) / width;
    }

    protected getBottom(y: number): number {
        const {y: yOrigin, height} = this.dimensionsConfig();
        return (100 * (y - yOrigin)) / height;
    }

    protected getLeft(x: number): number {
        const {x: xOrigin, width} = this.dimensionsConfig();
        return (100 * (x - xOrigin)) / width;
    }

    protected getOffset(x: number): number {
        const {value} = this.dataConfig();
        return (100 * ((value[x]?.[0] || 0) - this.getX(x))) / this.computeWidth(x);
    }

    private computeWidth(index: number): number {
        const {value} = this.dataConfig();

        return index === value.length - 1
            ? 2 * ((value[index]?.[0] || 0) - this.getX(index))
            : this.getX(index + 1) - this.getX(index);
    }

    // MÉTODOS DE HINTS - Formatação e contexto

    protected getHintId(index: number): string {
        return `${this.autoId}_${index}`;
    }

    protected getImplicit($implicit: TuiPoint): TuiPoint | readonly TuiPoint[] {
        const {value} = this.dataConfig();
        return (
            this.hintDirective?.getContext(value.indexOf($implicit), this) ?? $implicit
        );
    }

    protected getHovered(hovered: number | null): TuiPoint | null {
        const {value} = this.dataConfig();
        return tuiIsPresent(hovered) && Number.isInteger(hovered)
            ? (value[hovered] ?? null)
            : null;
    }
}
