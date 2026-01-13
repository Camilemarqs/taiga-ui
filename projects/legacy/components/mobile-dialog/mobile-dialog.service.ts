import {inject, Injectable} from '@angular/core';
import {type TuiPortalContext} from '@taiga-ui/cdk/portals';
import {TuiModalService} from '@taiga-ui/core/portals/modal';
import {type PolymorpheusContent} from '@taiga-ui/polymorpheus';
import {type Observable} from 'rxjs';

import {TuiMobileDialog} from './mobile-dialog.component';
import {
    TUI_MOBILE_DIALOG_OPTIONS,
    type TuiMobileDialogOptions,
} from './mobile-dialog.options';

@Injectable({
    providedIn: 'root',
})
export class TuiMobileDialogService<I = unknown> extends TuiModalService<
    TuiMobileDialogOptions<I>,
    number
> {
    protected readonly options = inject(TUI_MOBILE_DIALOG_OPTIONS);
    protected readonly content = TuiMobileDialog;

    public override open(
        content: PolymorpheusContent<
            TuiPortalContext<TuiMobileDialogOptions<I>, number>
        >,
        options: Partial<TuiMobileDialogOptions<I>> = {},
    ): Observable<number> {
        return super.open(content, options);
    }
}
