import {type PolymorpheusContent} from '@taiga-ui/polymorpheus';
import {type Type} from '@angular/core';
import {type TuiRawLoaderContent} from '@taiga-ui/addon-doc/types';

export interface TuiDocExampleMainConfig {
    readonly id: string | null;
    readonly heading: PolymorpheusContent | undefined;
    readonly description: PolymorpheusContent | undefined;
    readonly fullsize: boolean;
    readonly componentName: string;
    readonly component: Promise<Type<unknown>> | undefined;
    readonly content: Record<string, TuiRawLoaderContent>;
}

export interface TuiDocExampleStateConfig {
    readonly loading: boolean;
    readonly fullscreen: boolean;
    readonly activeItemIndex: number;
}
