import {Location} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    model,
    type OnInit,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, type Params, UrlSerializer} from '@angular/router';
import {TUI_DOC_ICONS, TUI_DOC_URL_STATE_HANDLER} from '@taiga-ui/addon-doc/tokens';
import {tuiCoerceValue, tuiInspect} from '@taiga-ui/addon-doc/utils';
import {tuiIsNumber} from '@taiga-ui/cdk/utils/miscellaneous';
import {TuiIcon} from '@taiga-ui/core/components/icon';
import {TuiInput} from '@taiga-ui/core/components/input';
import {TuiNotificationService} from '@taiga-ui/core/components/notification';
import {TuiDataListWrapper} from '@taiga-ui/kit/components/data-list-wrapper';
import {TuiInputNumber} from '@taiga-ui/kit/components/input-number';
import {TuiSelect} from '@taiga-ui/kit/components/select';
import {TuiSwitch} from '@taiga-ui/kit/components/switch';
import {TuiChevron} from '@taiga-ui/kit/directives/chevron';

import {TuiDocAPINumberItem} from './api-item-number.directive';
import {TuiInspectPipe} from './inspect.pipe';
import {TuiTypeReferencePipe} from './type-reference.pipe';
import {
    type TuiDocAPIItemBindingConfig,
    type TuiDocAPIItemMainConfig,
} from './api-item-config.interface';

const SERIALIZED_SUFFIX = '$';

@Component({
    selector: 'tr[tuiDocAPIItem]',
    imports: [
        FormsModule,
        TuiChevron,
        TuiDataListWrapper,
        TuiIcon,
        TuiInput,
        TuiInputNumber,
        TuiInspectPipe,
        TuiSelect,
        TuiSwitch,
        TuiTypeReferencePipe,
    ],
    templateUrl: './api-item.template.html',
    styleUrl: './api-item.style.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiDocAPIItem<T> implements OnInit {
    // SERVIÇOS E DEPENDÊNCIAS INJETADAS
    private readonly locationRef = inject(Location);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly urlSerializer = inject(UrlSerializer);
    private readonly urlStateHandler = inject(TUI_DOC_URL_STATE_HANDLER);
    private readonly alerts = inject(TuiNotificationService);
    protected readonly icons = inject(TUI_DOC_ICONS);
    protected readonly numberItem = inject(TuiDocAPINumberItem, {
        self: true,
        optional: true,
    });

    // INPUTS E MODEL - Configurações do componente
    public readonly name = input('');
    public readonly type = input('');
    public readonly value = model<T>();
    public readonly items = input<readonly T[]>([]);

    // CONFIGURAÇÕES AGRUPADAS - Agrega inputs relacionados para lógica interna

    /** Configuração principal agrupada */
    private readonly mainConfig = computed<TuiDocAPIItemMainConfig>(() => ({
        name: this.name(),
        type: this.type(),
        items: this.items(),
    }));

    /** Configuração de binding agrupada */
    protected readonly bindingConfig = computed<TuiDocAPIItemBindingConfig>(() => ({
        isBananaBox: this.mainConfig().name.startsWith('[('),
        isInput: this.mainConfig().name.startsWith('['),
        isOutput: this.mainConfig().name.startsWith('('),
    }));

    // COMPUTED VALUES - Validação e estado
    protected readonly isBananaBox = computed(() => this.bindingConfig().isBananaBox);
    protected readonly isInput = computed(() => this.bindingConfig().isInput);
    protected readonly isOutput = computed(() => this.bindingConfig().isOutput);

    protected readonly hasCleaner = computed(
        () =>
            this.mainConfig().type.includes('null') ||
            this.mainConfig().type.includes('PolymorpheusContent'),
    );

    // LIFECYCLE HOOKS

    public ngOnInit(): void {
        this.parseParams(this.activatedRoute.snapshot.queryParams);
    }

    // MÉTODOS PÚBLICOS - Manipulação de valor e eventos

    public onValueChange(value: T): void {
        this.value.set(value);
        this.setQueryParam(value);
    }

    public emitEvent(event: unknown): void {
        console.info('emitEvent', event);

        const alert =
            !event || event?.toString() === '[object Object]'
                ? tuiInspect(event, 2)
                : (event as string);

        this.alerts.open(alert, {label: this.mainConfig().name}).subscribe();
    }

    // MÉTODOS PRIVADOS - Manipulação de URL e parâmetros

    private clearBrackets(value: string): string {
        return value.replaceAll(/[()[\]]/g, '');
    }

    private parseParams(params: Params): void {
        const {name: configName, type, items} = this.mainConfig();
        const name = this.clearBrackets(configName);
        const propertyValue: string | undefined = params[name];
        const propertyValueWithSuffix: number | string | undefined =
            params[`${name}${SERIALIZED_SUFFIX}`];

        if (!propertyValue && !propertyValueWithSuffix) {
            return;
        }

        let value =
            !!propertyValueWithSuffix && items
                ? items[propertyValueWithSuffix as number]
                : tuiCoerceValue(propertyValue);

        if (type === 'string' && tuiIsNumber(value)) {
            value = value.toString();
        }

        this.onValueChange(value as T);
    }

    private setQueryParam(value: T | boolean | number | string | null): void {
        const {name: configName, items} = this.mainConfig();
        const tree = this.urlSerializer.parse(this.locationRef.path());

        const isValueAvailableByKey = value instanceof Object;
        const computedValue =
            isValueAvailableByKey && items ? items.indexOf(value as T) : value;

        const suffix = isValueAvailableByKey ? SERIALIZED_SUFFIX : '';
        const propName = this.clearBrackets(configName) + suffix;

        tree.queryParams = {
            ...tree.queryParams,
            [propName]: computedValue,
        };

        this.locationRef.go(this.urlStateHandler(tree));
    }
}
