import {Directive, ElementRef} from '@angular/core';
import {tuiInjectElement} from '@taiga-ui/cdk/utils/dom';

@Directive({
    selector: '[tuiResizable]',
})
export class TuiResizable<T extends Element = HTMLElement> implements ElementRef<T> {
    public nativeElement = tuiInjectElement<T>();

    constructor() {
        return new ElementRef<T>(this.nativeElement);
    }
}