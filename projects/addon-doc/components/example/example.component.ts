import {Clipboard} from '@angular/cdk/clipboard';
import {AsyncPipe, DOCUMENT, NgComponentOutlet} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    type OnChanges,
    signal,
    type Type,
} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {WA_LOCATION} from '@ng-web-apis/common';
import {
    TUI_DOC_CODE_ACTIONS,
    TUI_DOC_CODE_EDITOR,
    TUI_DOC_EXAMPLE_CONTENT_PROCESSOR,
    TUI_DOC_EXAMPLE_TEXTS,
    TUI_DOC_ICONS,
} from '@taiga-ui/addon-doc/tokens';
import {type TuiRawLoaderContent} from '@taiga-ui/addon-doc/types';
import {tuiRawLoadRecord} from '@taiga-ui/addon-doc/utils';
import {TuiMapperPipe} from '@taiga-ui/cdk/pipes/mapper';
import {type TuiContext} from '@taiga-ui/cdk/types';
import {TuiButton} from '@taiga-ui/core/components/button';
import {TuiLink} from '@taiga-ui/core/components/link';
import {TuiLoader} from '@taiga-ui/core/components/loader';
import {TuiNotificationService} from '@taiga-ui/core/components/notification';
import {TuiFullscreen} from '@taiga-ui/kit/components/fullscreen';
import {TuiTabs} from '@taiga-ui/kit/components/tabs';
import {TUI_COPY_TEXTS} from '@taiga-ui/kit/tokens';
import {type PolymorpheusContent, PolymorpheusOutlet} from '@taiga-ui/polymorpheus';
import {BehaviorSubject, map, switchMap} from 'rxjs';

import {TuiDocCode} from '../code';
import {TUI_DOC_EXAMPLE_OPTIONS} from './example.options';
import {TuiDocExampleGetTabsPipe} from './example-get-tabs.pipe';
import {
    type TuiDocExampleMainConfig,
    type TuiDocExampleStateConfig,
} from './example-config.interface';

@Component({
    selector: 'tui-doc-example',
    imports: [
        AsyncPipe,
        NgComponentOutlet,
        PolymorpheusOutlet,
        RouterLink,
        RouterLinkActive,
        TuiButton,
        TuiDocCode,
        TuiDocExampleGetTabsPipe,
        TuiFullscreen,
        TuiLink,
        TuiLoader,
        TuiMapperPipe,
        TuiTabs,
    ],
    templateUrl: './example.template.html',
    styleUrl: './example.style.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[attr.id]': 'id()',
        '[class._fullsize]': 'fullsize()',
    },
})
export class TuiDocExample implements OnChanges {
    // SERVIÇOS E DEPENDÊNCIAS INJETADAS
    private readonly clipboard = inject(Clipboard);
    private readonly alerts = inject(TuiNotificationService);
    private readonly location = inject(WA_LOCATION);
    private readonly copyTexts = inject(TUI_COPY_TEXTS);
    private readonly processContent = inject(TUI_DOC_EXAMPLE_CONTENT_PROCESSOR);
    protected readonly fullscreenEnabled = inject(DOCUMENT).fullscreenEnabled;
    protected readonly icons = inject(TUI_DOC_ICONS);
    protected readonly options = inject(TUI_DOC_EXAMPLE_OPTIONS);
    protected readonly texts = inject(TUI_DOC_EXAMPLE_TEXTS);
    protected readonly codeEditor = inject(TUI_DOC_CODE_EDITOR, {optional: true});
    protected readonly codeActions =
        inject<ReadonlyArray<PolymorpheusContent<TuiContext<string>>>>(
            TUI_DOC_CODE_ACTIONS,
        );
    protected readonly route = inject(ActivatedRoute);

    // INPUTS - Configurações do componente
    public readonly id = input<string | null>(null);
    public readonly heading = input<PolymorpheusContent>();
    public readonly description = input<PolymorpheusContent>();
    public readonly fullsize = input(inject(TUI_DOC_EXAMPLE_OPTIONS).fullsize);
    public readonly componentName = input<string>(this.location.pathname.slice(1));
    public readonly component = input<Promise<Type<unknown>>>();
    public readonly content = input<Record<string, TuiRawLoaderContent>>({});

    // ESTADO E SUBJECTS
    private readonly rawLoader$$ = new BehaviorSubject<
        Record<string, TuiRawLoaderContent>
    >({});
    protected readonly loading = signal(false);
    protected readonly defaultTabIndex = 0;
    protected readonly defaultTab = this.texts[this.defaultTabIndex];
    protected activeItemIndex = this.defaultTabIndex;
    protected fullscreen = false;

    // CONFIGURAÇÕES AGRUPADAS - Agrega inputs relacionados para lógica interna

    /** Configuração principal agrupada */
    private readonly mainConfig = computed<TuiDocExampleMainConfig>(() => ({
        id: this.id(),
        heading: this.heading(),
        description: this.description(),
        fullsize: this.fullsize(),
        componentName: this.componentName(),
        component: this.component(),
        content: this.content(),
    }));

    /** Configuração de estado agrupada */
    protected readonly stateConfig = computed<TuiDocExampleStateConfig>(() => ({
        loading: this.loading(),
        fullscreen: this.fullscreen,
        activeItemIndex: this.activeItemIndex,
    }));

    // COMPUTED VALUES - Processamento e formatação
    protected readonly copy = computed(() => this.copyTexts()[0]);

    protected readonly processor = toSignal(
        this.rawLoader$$.pipe(
            switchMap(tuiRawLoadRecord),
            map((value) => this.processContent(value)),
        ),
        {initialValue: {} as unknown as Record<string, string>},
    );

    // LIFECYCLE HOOKS

    public ngOnChanges(): void {
        this.rawLoader$$.next(this.mainConfig().content);
    }

    // MÉTODOS PROTEGIDOS - Helpers e utilitários

    protected readonly visible = (files: Record<string, string>): boolean =>
        Boolean(this.codeEditor && this.options.codeEditorVisibilityHandler(files));

    protected getTabTitle(fileName: string): PolymorpheusContent {
        return this.options.tabTitles.get(fileName) || fileName;
    }

    // MÉTODOS PROTEGIDOS - Ações do usuário

    protected copyExampleLink(target: EventTarget | null): void {
        this.clipboard.copy((target as HTMLAnchorElement | null)?.href ?? '');
        this.alerts
            .open(this.texts[1], {label: this.texts[2], appearance: 'positive'})
            .subscribe();
    }

    protected edit(files: Record<string, string>): void {
        const {componentName, id} = this.mainConfig();
        this.loading.set(true);
        this.codeEditor
            ?.edit(componentName, id || '', files)
            .finally(() => this.loading.set(false));
    }
}
