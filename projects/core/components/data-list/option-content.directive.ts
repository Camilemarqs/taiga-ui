import {
    ContentChild,
    Directive,
    inject,
    InjectionToken,
    type Provider,
    type Type,
} from '@angular/core';

export interface TuiOptionContent {
    // Define shared behaviors here if needed in the future
}

export const TUI_OPTION_CONTENT =
    new InjectionToken<Type<TuiOptionContent>>(
        ngDevMode ? 'TUI_OPTION_CONTENT' : '',
);

export function tuiAsOptionContent(
    useValue: Type<TuiOptionContent>,
): Provider {
    return {provide: TUI_OPTION_CONTENT, useValue};
}

@Directive()
export class TuiWithOptionContent {
    @ContentChild(TUI_OPTION_CONTENT, {descendants: true})
    protected readonly local: Type<TuiOptionContent> | null = null;

    protected readonly global =
        inject<Type<TuiOptionContent>>(TUI_OPTION_CONTENT, {optional: true});

    public get content(): Type<TuiOptionContent> | null {
        return this.global ?? this.local;
    }
}