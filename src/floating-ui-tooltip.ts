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

// TODO: but this shouldn't change if it isn't newlyShown right?
const getPosition = ({ passedPlacement, fui, newlyShown }): Position => {
  const {
    position,
    orientation
  } = passedPlacement;
  if (!fui || !newlyShown) return position;
  const { x, y } = fui;
  // if x or y is less than 0, and orientation is auto: return auto
  if (x < 0 || y < 0) {
    if (orientation === 'auto') {
      return 'auto';
    }
  }
  return position;
}

const computeTooltip = async ({ passedPlacement, passedOffset, resetPlacementOnUpdate, newlyShown, toShift, toShowArrow, arrowElement, tooltipElement, target }) => {

  const position = getPosition({
    passedPlacement,
    fui: tooltipElement['_instance'].state.fui,
    newlyShown
  });
  console.log(`fui is:`)
  console.log(tooltipElement['_instance'].state.fui)
  console.log(`position now should be ${position}`)

  const toEnableAutoPlacement = position === 'auto' && (newlyShown || resetPlacementOnUpdate);
  const toEnableShift = toShift && newlyShown;

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
  return await computePosition(target, tooltipElement, computePositionConfig);
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

  if(!target) return;

  let fui = await computeTooltip({ passedPlacement, passedOffset, resetPlacementOnUpdate, toShift, toShowArrow, arrowElement, tooltipElement, target, newlyShown });

  if (newlyShown) {
    console.log('---')
    console.log('refiring computePosition because it\'s newlyshown')
    fui = await computeTooltip({ passedPlacement, passedOffset, resetPlacementOnUpdate, toShift, toShowArrow, arrowElement, tooltipElement, target, newlyShown });
    console.log(`fui is:`)
    console.log(tooltipElement['_instance'].state.fui)
    console.log('---')
  }

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

  console.log(`to change visibility to: ${visibility}`)

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

  const TIP_SIZE = arrowSizeScale * DEFAULT_TIP_SIZE;

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
