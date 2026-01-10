export interface TuiDocPageMainConfig {
    readonly header: string;
    readonly package: string;
    readonly type: string;
    readonly tags: string[];
    readonly path: string;
    readonly deprecated: boolean | '';
}

export interface TuiDocPageViewConfig {
    readonly activeItemIndex: number;
    readonly showSeeAlso: boolean;
}
