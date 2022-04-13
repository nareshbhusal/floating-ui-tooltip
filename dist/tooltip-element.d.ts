export declare const NODE_CLASSNAME_PREFIX = "floating-ui-tooltip";
export declare function div(): HTMLDivElement;
declare const createTooltipElement: () => HTMLDivElement;
export interface TooltipElementChildren {
    box: HTMLDivElement;
    content: HTMLDivElement;
    arrow: HTMLDivElement;
}
export declare function getChildren(tooltipElement: Element): TooltipElementChildren;
export default createTooltipElement;
