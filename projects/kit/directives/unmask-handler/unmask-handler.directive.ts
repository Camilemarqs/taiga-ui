import {Directive, input} from '@angular/core';
import {
    MASKITO_DEFAULT_OPTIONS,
    type MaskitoOptions,
    maskitoTransform,
} from '@maskito/core';
import {TuiValueTransformer} from '@taiga-ui/cdk/classes';
import {type TuiMapper} from '@taiga-ui/cdk/types';
import {tuiProvide} from '@taiga-ui/cdk/utils/di';
import {identity} from 'rxjs';

@Directive({
    selector: '[maskito][tuiUnmaskHandler]',
    providers: [tuiProvide(TuiValueTransformer, TuiUnmaskHandler)],
})
export class TuiUnmaskHandler extends TuiValueTransformer<string> {
    public readonly tuiUnmaskHandler = input<TuiMapper<[string], string>>(identity);
    public readonly maskito = input<MaskitoOptions | null>(null);

    public override fromControlValue(controlValue: unknown): string {
        return this.transformWithMaskito(controlValue);
    }

    public override toControlValue(value: string): string {
        return this.applyUnmaskHandler(value);
    }

    private transformWithMaskito(controlValue: unknown): string {
        const stringValue = String(controlValue ?? '');
        const maskOptions = this.maskito() || MASKITO_DEFAULT_OPTIONS;
        return maskitoTransform(stringValue, maskOptions);
    }

    private applyUnmaskHandler(value: string): string {
        return this.tuiUnmaskHandler()(value);
    }
}
