import { Props, TooltipState } from './types';
declare const floatingUITooltip: (tooltipProps: Props, tooltipElement: HTMLElement, target: HTMLElement, toHide: boolean, toResetPosition: boolean | undefined, setState: (state: Partial<TooltipState>) => void) => Promise<void | import("@floating-ui/dom").ComputePositionReturn>;
export default floatingUITooltip;
