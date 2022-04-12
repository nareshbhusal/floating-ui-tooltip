import { Placement as FUIPlacement, ComputePositionReturn } from '@floating-ui/dom';

export type Placement = FUIPlacement | 'auto';

export interface Props {
  allowHTML: boolean;
  // content: string | HTMLElement | ((target: Element) => HTMLElement);
  content: string;
  arrow: boolean;
  transitionDuration: number | [number | null, number | null];
  offset: [number | undefined, number | undefined];
  hideOnClick: boolean | 'target';
  onClickOutside: (instance: Instance, event: MouseEvent) => void;
  onShow: (instance: Instance) => void;
  onHide: (instance: Instance) => void;
  onRemove: () => void;
  placement: Placement;
  resetPlacementOnUpdate: boolean;
  hideOnTooltipEscape: boolean;
  hideOnReferenceHidden: boolean;
  showOnCreate: boolean;
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
  show: () => Promise<void>;
  hide: () => Promise<void>;
  remove: () => Promise<void>;
  update: () => Promise<void>;
}
