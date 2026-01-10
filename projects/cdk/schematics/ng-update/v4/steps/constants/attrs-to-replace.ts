import {hasElementAttribute} from '../../../../utils/templates/elements';
import {findAttr} from '../../../../utils/templates/inputs';
import {type ReplacementAttribute} from '../../../interfaces';

// Helper functions to create ReplacementAttribute objects

function createAttrReplacement(
    fromAttr: string,
    toAttr: string,
    withTagNames?: string[],
): ReplacementAttribute {
    return {
        from: {
            attrName: fromAttr,
            ...(withTagNames && {withTagNames}),
        },
        to: {attrName: toAttr},
    };
}

function createAttrReplacementWithAttrs(
    fromAttr: string,
    toAttr: string,
    withAttrsNames: string[],
    withTagNames?: string[],
): ReplacementAttribute {
    return {
        from: {
            attrName: fromAttr,
            withAttrsNames,
            ...(withTagNames && {withTagNames}),
        },
        to: {attrName: toAttr},
    };
}

function createAttrReplacementWithFilter(
    fromAttr: string,
    toAttr: string,
    withAttrsNames: string[],
    filterFn: (element: Element) => boolean,
): ReplacementAttribute {
    return {
        from: {
            attrName: fromAttr,
            withAttrsNames,
            filterFn,
        },
        to: {attrName: toAttr},
    };
}

// Card and thumbnail card replacements
const cardReplacements: ReplacementAttribute[] = [
    createAttrReplacement('brandLogo', 'iconStart', ['tui-card', 'tui-thumbnail-card']),
    createAttrReplacement('[brandLogo]', '[iconStart]', [
        'tui-card',
        'tui-thumbnail-card',
    ]),
];

// SVG replacements
const svgReplacements: ReplacementAttribute[] = [
    createAttrReplacement('src', 'icon', ['tui-svg']),
    createAttrReplacement('[src]', '[icon]', ['tui-svg']),
];

// Badge replacements
const badgeReplacements: ReplacementAttribute[] = [
    createAttrReplacement('status', 'appearance', ['tui-badge']),
    createAttrReplacement('[status]', '[appearance]', ['tui-badge']),
];

// Radio replacements
const radioReplacements: ReplacementAttribute[] = [
    createAttrReplacement('item', 'value', [
        'tui-radio',
        'tui-radio-labeled',
        'tui-radio-block',
    ]),
    createAttrReplacement('[item]', '[value]', [
        'tui-radio',
        'tui-radio-labeled',
        'tui-radio-block',
    ]),
];

// File replacements
const fileReplacements: ReplacementAttribute[] = [
    createAttrReplacement('(removed)', '(remove)', ['tui-file']),
];

// Avatar replacements
const avatarReplacements: ReplacementAttribute[] = [
    createAttrReplacement('[rounded]', '[round]', ['tui-avatar']),
    createAttrReplacement('tuiMarkerIcon', 'tuiAvatar', ['button', 'a']),
];

// Hosted dropdown replacements
const hostedDropdownReplacements: ReplacementAttribute[] = [
    createAttrReplacement('[content]', '[tuiDropdown]', ['tui-hosted-dropdown']),
    createAttrReplacement('[sided]', '[tuiDropdownSided]', ['tui-hosted-dropdown']),
    createAttrReplacement('[canOpen]', '[tuiDropdownEnabled]', ['tui-hosted-dropdown']),
    createAttrReplacement('[open]', '[tuiDropdownOpen]', ['tui-hosted-dropdown']),
    createAttrReplacement('[(open)]', '[(tuiDropdownOpen)]', ['tui-hosted-dropdown']),
    createAttrReplacement('(openChange)', '(tuiDropdownOpenChange)', [
        'tui-hosted-dropdown',
    ]),
    createAttrReplacement('(focusedChange)', '(tuiActiveZoneChange)', [
        'tui-hosted-dropdown',
    ]),
    createAttrReplacement('tuiHostedDropdownHost', '#tuiDropdownHost', ['*']),
];

// Progress replacements
const progressReplacements: ReplacementAttribute[] = [
    createAttrReplacement('[colors]', '[tuiProgressColorSegments]', [
        'tui-progress-segmented',
    ]),
    createAttrReplacement('new', '', ['tui-progress-circle']),
];

// Marker icon replacements
const markerIconReplacements: ReplacementAttribute[] = [
    createAttrReplacementWithAttrs(
        'mode',
        'appearance',
        ['tuiMarkerIcon'],
        ['tui-marker-icon'],
    ),
    createAttrReplacementWithAttrs(
        '[mode]',
        '[appearance]',
        ['tuiMarkerIcon'],
        ['tui-marker-icon'],
    ),
    createAttrReplacementWithAttrs(
        'tuiAction',
        'tuiCardLarge tuiSurface="elevated"',
        ['tuiMarkerIcon'],
        ['button', 'a'],
    ),
];

// Button icon replacements
const buttonIconReplacements: ReplacementAttribute[] = [
    createAttrReplacementWithAttrs('icon', 'iconStart', ['tuiButton', 'tuiIconButton']),
    createAttrReplacementWithAttrs('[icon]', '[iconStart]', [
        'tuiButton',
        'tuiIconButton',
    ]),
    createAttrReplacementWithAttrs('iconLeft', 'iconStart', [
        'tuiButton',
        'tuiIconButton',
    ]),
    createAttrReplacementWithAttrs('[iconLeft]', '[iconStart]', [
        'tuiButton',
        'tuiIconButton',
    ]),
    createAttrReplacementWithAttrs('iconRight', 'iconEnd', [
        'tuiButton',
        'tuiIconButton',
    ]),
    createAttrReplacementWithAttrs('[iconRight]', '[iconEnd]', [
        'tuiButton',
        'tuiIconButton',
    ]),
];

// Link icon replacements (with filters)
const linkIconReplacements: ReplacementAttribute[] = [
    createAttrReplacementWithFilter(
        'icon',
        'iconEnd',
        ['tuiLink'],
        (element) =>
            !hasElementAttribute(element, 'iconAlign') ||
            findAttr(element.attrs, 'iconAlign')?.value === 'right',
    ),
    createAttrReplacementWithFilter(
        '[icon]',
        '[iconEnd]',
        ['tuiLink'],
        (element) =>
            !hasElementAttribute(element, 'iconAlign') ||
            findAttr(element.attrs, 'iconAlign')?.value === 'right',
    ),
    createAttrReplacementWithFilter(
        'icon',
        'iconStart',
        ['tuiLink'],
        (element) => findAttr(element.attrs, 'iconAlign')?.value === 'left',
    ),
    createAttrReplacementWithFilter(
        '[icon]',
        '[iconStart]',
        ['tuiLink'],
        (element) => findAttr(element.attrs, 'iconAlign')?.value === 'left',
    ),
];

// Notification replacements
const notificationReplacements: ReplacementAttribute[] = [
    createAttrReplacementWithAttrs(
        'status',
        'appearance',
        ['tuiNotification'],
        ['tui-notification'],
    ),
    createAttrReplacementWithAttrs(
        '[status]',
        '[appearance]',
        ['tuiNotification'],
        ['tui-notification'],
    ),
];

// Miscellaneous replacements
const miscellaneousReplacements: ReplacementAttribute[] = [
    createAttrReplacement('(tuiResize)', '(waResizeObserver)', ['*']),
    createAttrReplacement('tuiTextfield', 'tuiTextfieldLegacy', ['input', 'textarea']),
    createAttrReplacement('*tuiRow', '*ngFor', ['tr']),
    createAttrReplacement('tuiResizeable', 'tuiResizable', ['*']),
];

export const ATTRS_TO_REPLACE: ReplacementAttribute[] = [
    ...cardReplacements,
    ...svgReplacements,
    ...badgeReplacements,
    ...radioReplacements,
    ...fileReplacements,
    ...avatarReplacements,
    ...hostedDropdownReplacements,
    ...progressReplacements,
    ...markerIconReplacements,
    ...buttonIconReplacements,
    ...linkIconReplacements,
    ...notificationReplacements,
    ...miscellaneousReplacements,
];
