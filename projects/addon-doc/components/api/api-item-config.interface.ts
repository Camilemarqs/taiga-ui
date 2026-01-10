export interface TuiDocAPIItemMainConfig {
    readonly name: string;
    readonly type: string;
    readonly items: readonly unknown[];
}

export interface TuiDocAPIItemBindingConfig {
    readonly isBananaBox: boolean;
    readonly isInput: boolean;
    readonly isOutput: boolean;
}
