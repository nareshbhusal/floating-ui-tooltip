import { Placement as FUIPlacement, ComputePositionReturn } from '@floating-ui/dom';

export type Placement = FUIPlacement | 'auto';

export interface Props {
  allowHTML: boolean;
  // content: string | HTMLElement | ((target: Element) => HTMLElement);
  content: string;
  transitionDuration: number | [number | null, number | null];
  offset: [number | undefined, number | undefined];
  hideOnClick: boolean | 'target';
  placement: Placement;
  hideOnTooltipEscape: boolean;
  hideOnReferenceHidden: boolean;
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

export interface Instance {
  props: Props;
  reference: HTMLElement;
  getState: () => TooltipState;
  show: () => void;
  hide: () => void;
  remove: () => void;
}
