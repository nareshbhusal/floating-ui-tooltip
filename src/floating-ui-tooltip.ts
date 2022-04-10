import {
  computePosition,
  size,
  flip,
  shift,
  offset,
  arrow,
  autoPlacement,
  hide,
} from '@floating-ui/dom';
import { getChildren } from './tooltip-element';
import { Props, TooltipState } from './types';

const SCREEN_EDGE_MARGIN = 16;
const TIP_EDGE_MARGIN = 2;
const DEFAULT_TIP_SIZE = 12;
const TIP_WIDTH = Math.sqrt(2 * DEFAULT_TIP_SIZE ** 2) / 2;

const TIP_SIDES_MAP = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};

const floatingUITooltip = async (
  tooltipProps: Props,
  tooltipElement: HTMLElement,
  target: HTMLElement,
  toHide: boolean,
  newlyShown: boolean,
  setShowState: (state: Partial<TooltipState>)=> void
) => {
 const { toFlip=false, toShift=true } = {};

  const {
    placement: passedPlacement,
    hideOnReferenceHidden,
    offset: passedOffset,
    hideOnTooltipEscape,
    arrowSizeScale,
    resetPlacementOnUpdate
  } = tooltipProps;
  console.log(passedPlacement !== 'auto' && toFlip)

  const { box, content, arrow: arrowElement } = getChildren(tooltipElement);
  const TIP_SIZE = arrowSizeScale * DEFAULT_TIP_SIZE

  if(!target) return;
  const computePositionConfig = {
    middleware: [
      offset({
        mainAxis: passedOffset[0],
        crossAxis: passedOffset[1]
      }),
      ...passedPlacement === 'auto' && (newlyShown || resetPlacementOnUpdate) ? [
        autoPlacement(),
      ]: [],
      ...toShift ? [
        shift({ padding: SCREEN_EDGE_MARGIN }),
      ]: [],
      ...(passedPlacement !== 'auto' && toFlip) ? [
        flip({
          fallbackPlacements: ['right', 'left'],
          fallbackStrategy: 'initialPlacement' // or `bestFit` (when no placement fits perfectly)
        })
      ]: [],
      arrow({
        element: arrowElement,
        padding: TIP_EDGE_MARGIN,
      }),
      size({
        apply({width, height, reference, floating}) {
        }
      }),
      hide()
    ]
  }

  if (passedPlacement !== 'auto') {
    computePositionConfig['placement'] = passedPlacement;
  }

  const fui = await computePosition(target, tooltipElement, computePositionConfig);
  const { x, y, placement, middlewareData } = fui;

  const { referenceHidden, escaped } = middlewareData.hide!;

  let arrowX,
  arrowY;
  if(middlewareData.arrow){
    arrowX = middlewareData.arrow.x;
    arrowY = middlewareData.arrow.y;
  }
  const arrowOffCenter = middlewareData.arrow!.centerOffset !== 0;

  const visibility = ((
    hideOnReferenceHidden && referenceHidden)
    || (hideOnTooltipEscape && escaped)
    || toHide) ? 'hidden' : 'visible';

  tooltipElement.setAttribute('data-state', visibility);

  setShowState({
    isShown: visibility === 'visible',
    fui
  });

  Object.assign(tooltipElement.style, {
    visibility,
    left: `${x}px`,
    top: `${y}px`
  });

  const staticSide = TIP_SIDES_MAP[placement.split("-")[0]];
  let staticSideTipSizeMultiplier: string | number = 0;
  let top: string | number = 0;
  let left: string | number = 0;
  left = arrowX !== null ? `${arrowX + (TIP_SIZE)}px` : "";

  switch(staticSide) {
    case 'top':
      staticSideTipSizeMultiplier = 1/1.7;
      left = arrowX !== null ? `${arrowX + (TIP_SIZE*staticSideTipSizeMultiplier)}px` : "";
    break;
    case 'bottom':
      staticSideTipSizeMultiplier = 1/2;
      left = arrowX !== null ? `${arrowX + (TIP_SIZE*staticSideTipSizeMultiplier)}px` : "";
    break;
    case 'left':
      staticSideTipSizeMultiplier = 0.005;
      left = arrowX !== null ? `${arrowX}px` : "",
      top = arrowY !== null ? `${arrowY - (TIP_SIZE*staticSideTipSizeMultiplier)/2}px` : "";
    break;
    case 'right':
      staticSideTipSizeMultiplier = 1.2;
      left = arrowX !== null ? `${arrowX}px` : "",
      top = arrowY !== null ? `${arrowY - (TIP_SIZE*staticSideTipSizeMultiplier)/2}px` : "";
    break;
  }

  top = arrowY !== null ? `${arrowY - (TIP_SIZE*staticSideTipSizeMultiplier)/2}px` : "";

  top = arrowY !== null ? `${arrowY}px` : "";
  Object.assign(arrowElement.style, {
    visibility: arrowOffCenter ? 'hidden' : 'visible',
    left,
    top,
    right: "",
    bottom: "",
    [staticSide]: `-${TIP_SIZE*staticSideTipSizeMultiplier}px`
  });

  return fui;
}

export default floatingUITooltip;
