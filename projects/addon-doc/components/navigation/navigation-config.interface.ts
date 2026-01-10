import {type TuiDocRoutePage} from '@taiga-ui/addon-doc/types';

export interface TuiDocNavigationStateConfig {
    readonly menuOpen: boolean;
    readonly open: boolean;
    readonly active: string;
    readonly openPagesArr: readonly boolean[];
    readonly openPagesGroupsArr: readonly boolean[];
}

export interface TuiDocNavigationSearchConfig {
    readonly search: string;
    readonly canOpen: boolean;
    readonly filtered: ReadonlyArray<readonly TuiDocRoutePage[]>;
}
