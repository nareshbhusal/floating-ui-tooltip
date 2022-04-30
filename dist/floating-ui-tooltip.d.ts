import { Props, TooltipState } from './types';
declare const floatingUITooltip: (tooltipProps: Props, tooltipElement: HTMLElement, target: HTMLElement, toHide: boolean, toResetPosition: boolean | undefined, setState: (state: Partial<TooltipState>) => void) => Promise<import("@floating-ui/dom").ComputePositionReturn | undefined>;
export default floatingUITooltip;
