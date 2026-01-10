import {type PolymorpheusContent} from '@taiga-ui/polymorpheus';
import {type TuiCardInputs} from './input-card-group.options';

export interface TuiInputCardGroupMainConfig {
    readonly placeholder: string;
    readonly inputs: TuiCardInputs;
    readonly cardValidator: (value: string) => boolean;
    readonly icon: PolymorpheusContent;
    readonly id: string;
    readonly codeLength: 3 | 4 | undefined;
}

export interface TuiInputCardGroupStateConfig {
    readonly expirePrefilled: boolean;
}
