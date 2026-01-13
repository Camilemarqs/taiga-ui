import {
    effect,
    inject,
    type InjectOptions,
    isSignal,
    type ProviderToken,
    type Signal,
    signal,
    type WritableSignal,
} from '@angular/core';
import {tuiSetSignal} from '@taiga-ui/cdk/utils/miscellaneous';

type SignalLikeTypeOf<T> = T extends Signal<infer R> ? R : T;

type SignalLike<T> = Signal<T> | T;

type ValueType<T, G extends keyof T> = SignalLikeTypeOf<T[G]>;

// TODO: Consider {} as default options instead
export function tuiDirectiveBinding<
    T,
    G extends keyof T,
    I extends SignalLike<ValueType<T, G>>,
>(
    token: ProviderToken<T>,
    key: G,
    initial: I,
    options: InjectOptions = {self: true},
): I extends Signal<ValueType<T, G>> ? I : WritableSignal<ValueType<T, G>> {
    type V = ValueType<T, G>;
    const result: I extends Signal<V> ? I : WritableSignal<V> = isSignal(initial)
        ? (initial as I extends Signal<V> ? I : never)
        : (signal(initial) as WritableSignal<V>);
    const directive: T | null = inject(token, options);
    const output = directive?.[`${key.toString()}Change` as keyof T] as
        | {emit: (value: V) => void}
        | undefined;

    if (!directive) {
        return result;
    }

    // TODO: Figure out why effects are executed all the time and not just when result changes (check with Angular 18)
    let previous: V | undefined;

    effect(() => {
        const value: V = result() as V;

        if (previous === value) {
            return;
        }

        const directiveKey = directive[key];
        if (isSignal(directiveKey)) {
            tuiSetSignal(directiveKey as WritableSignal<V> | Signal<V>, value);
        } else {
            (directive as Record<keyof T, V>)[key] = value;
        }

        (directive as {ngOnChanges?: (changes: Record<string, unknown>) => void})
            .ngOnChanges?.({});
        output?.emit?.(value);
        previous = value;
    });

    return result;
}
