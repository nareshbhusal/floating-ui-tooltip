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
import { Props, TooltipState, Visibility, Placement, Position } from './types';
import { scrollElementIntoView } from './utils';
import setTooltipVisibility from './setTooltipVisibility';

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

const getPosition = ({ passedPlacement, fui }): Position => {
  const {
    position,
    orientation
  } = passedPlacement;
  if (!fui) return position;
  const { x, y } = fui;
  if (position !== 'auto' && (x < 0 || y < 0)) {
    if (orientation === 'auto') {
      return 'auto';
    }
  }
  return position;
}

const floatingUITooltip = async (
  tooltipProps: Props,
  tooltipElement: HTMLElement,
  target: HTMLElement,
  toHide: boolean,
  newlyShown: boolean,
  setState: (state: Partial<TooltipState>)=> void
) => {
 const { toFlip=false, toShift=true } = {};

  let {
    placement: passedPlacement,
    hideOnReferenceHidden,
    offset: passedOffset,
    hideOnTooltipEscape,
    arrowSizeScale,
    resetPlacementOnUpdate,
    arrow: toShowArrow,
    scrollIntoView,
    showOnCreate
  } = tooltipProps;

  const { arrow: arrowElement } = getChildren(tooltipElement);
  const TIP_SIZE = arrowSizeScale * DEFAULT_TIP_SIZE;


  if(!target) return;

  const position = getPosition({
    passedPlacement,
    fui: tooltipElement['_instance'].state.fui
  });

  const toEnableAutoPlacement = position === 'auto' && (newlyShown || resetPlacementOnUpdate);
  const toEnableShift = toShift && newlyShown;

  // TODO: we want to be able to take any placement including auto, and also
  // orientation of `fixed` or `auto`
  // -- if passedPlacement is other than auto, and orientation is auto
  // -- -- if x or y is in negative, we make placement auto

  const computePositionConfig = {
    ...position !== 'auto' && {
      placement: position,
    },
    middleware: [
      offset({
        mainAxis: passedOffset[0],
        crossAxis: passedOffset[1]
      }),
      ...toEnableAutoPlacement ? [
        autoPlacement(),
      ]: [],
      ...toEnableShift ? [
        shift({ padding: SCREEN_EDGE_MARGIN }),
      ]: [],
      ...toShowArrow ? [
        arrow({
          element: arrowElement,
          padding: TIP_EDGE_MARGIN,
        })
      ]: [],
      size({
        apply({width, height, reference, floating}) {
        }
      }),
      hide()
    ]
  }

  console.log(`computePositionConfig`)
  console.log(computePositionConfig);

  const fui = await computePosition(target, tooltipElement, computePositionConfig);
  const { x, y, placement, middlewareData } = fui;

  const { referenceHidden, escaped } = middlewareData.hide!;

  if (referenceHidden && newlyShown && scrollIntoView) {
    scrollElementIntoView(target);
  }

  let arrowX,
  arrowY;
  if(middlewareData.arrow){
    arrowX = middlewareData.arrow.x;
    arrowY = middlewareData.arrow.y;
  }
  const arrowOffCenter = middlewareData.arrow!.centerOffset !== 0;

  let visibility: Visibility = ((
    hideOnReferenceHidden && referenceHidden)
    || (hideOnTooltipEscape && escaped)
    || toHide) ? 'hidden' : 'visible' as const;

  if (visibility === 'visible' && newlyShown && !showOnCreate){
    visibility = 'hidden' as const;
  }
  /* console.log(hideOnReferenceHidden && referenceHidden, hideOnTooltipEscape && escaped, toHide)
  console.log(visibility); */

  setTooltipVisibility(<HTMLDivElement>tooltipElement, visibility);

  Object.assign(tooltipElement.style, {
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

  setState({
    fui
  });

  return fui;
}

export default floatingUITooltip;
