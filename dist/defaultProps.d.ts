import { Instance, TooltipState } from './types';
declare const defaultProps: {
    allowHTML: boolean;
    content: string;
    arrow: boolean;
    scrollIntoView: boolean;
    transitionDuration: number[];
    offset: number[];
    hideOnClick: boolean;
    onClickOutside: (instance: Instance, event: MouseEvent) => void;
    onShow: (instance: Instance) => void;
    onHide: (instance: Instance) => void;
    onStateChange: (oldState: TooltipState, newState: Partial<TooltipState>) => void;
    onRemove: () => void;
    placement: {
        position: string;
        orientation: string;
    };
    resetPlacementOnUpdate: boolean;
    hideOnTooltipEscape: boolean;
    hideOnReferenceHidden: boolean;
    showOnCreate: boolean;
    maxWidth: number;
    updateDebounce: number;
    zIndex: number;
    arrowSizeScale: number;
    updateOnEvents: string;
};
export default defaultProps;
