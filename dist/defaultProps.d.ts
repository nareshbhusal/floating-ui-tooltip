import { Instance } from './types';
declare const defaultProps: {
    allowHTML: boolean;
    content: string;
    transitionDuration: number[];
    offset: number[];
    hideOnClick: boolean;
    onClickOutside: (instance: Instance, event: MouseEvent) => void;
    placement: string;
    resetPlacementOnUpdate: boolean;
    hideOnTooltipEscape: boolean;
    hideOnReferenceHidden: boolean;
    maxWidth: number;
    updateDebounce: number;
    zIndex: number;
    arrowSizeScale: number;
    updateOnEvents: string;
};
export default defaultProps;
