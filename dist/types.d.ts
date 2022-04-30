import { Placement as FUIPlacement, ComputePositionReturn } from '@floating-ui/dom';
export declare type Position = FUIPlacement | 'auto';
export declare type Orientation = 'fixed' | 'auto';
export interface Placement {
    position: Position;
    orientation: Orientation;
}
export interface Props {
    allowHTML: boolean;
    content: string;
    arrow: boolean;
    transitionDuration: number | [number | null, number | null];
    offset: [number | undefined, number | undefined];
    hideOnClick: boolean | 'target';
    onClickOutside: (instance: Instance, event: MouseEvent) => void;
    onShow: (instance: Instance) => void;
    onHide: (instance: Instance) => void;
    onStateChange: (oldState: TooltipState, newState: Partial<TooltipState>) => void;
    onRemove: () => void;
    onBeforeFirstRender: () => void;
    placement: Placement;
    resetPlacementOnUpdate: boolean;
    hideOnTooltipEscape: boolean;
    hideOnReferenceHidden: boolean;
    showOnCreate: boolean;
    scrollIntoView: boolean;
    maxWidth: number;
    arrowSizeScale: number;
    updateDebounce: number;
    zIndex: number;
    updateOnEvents: string;
}
export interface TooltipState {
    isShown: boolean;
    isRemoved: boolean;
    fui: ComputePositionReturn | undefined;
}
export declare type Visibility = 'hidden' | 'visible';
export declare type TransitionState = 'hidden' | 'shown' | 'hiding' | 'showing';
export interface Instance {
    props: Props;
    reference: HTMLElement;
    tooltipElement: HTMLElement;
    getState: () => TooltipState;
    show: () => void;
    hide: () => void;
    remove: () => void;
    update: () => void;
}
