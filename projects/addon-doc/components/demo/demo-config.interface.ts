export interface TuiDocDemoThemeConfig {
    readonly dark: boolean;
    readonly theme: 'dark' | 'light';
}

export interface TuiDocDemoSandboxConfig {
    readonly opaque: boolean;
    readonly expanded: boolean;
    readonly sandboxWidth: number;
}

export interface TuiDocDemoFormConfig {
    readonly updateOn: 'blur' | 'change' | 'submit';
}
