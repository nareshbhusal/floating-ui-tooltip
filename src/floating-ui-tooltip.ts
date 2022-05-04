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

import { SCREEN_EDGE_MARGIN, TIP_EDGE_MARGIN, DEFAULT_TIP_SIZE } from './constants';

const TIP_WIDTH = Math.sqrt(2 * DEFAULT_TIP_SIZE ** 2) / 2;

const TIP_SIDES_MAP = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};

const isElementOverflowingDocument = (element) => {
  const elementRect = element.getBoundingClientRect();
  const documentRect = document.documentElement.getBoundingClientRect();
  return elementRect.top < documentRect.top ||
    elementRect.bottom > documentRect.bottom ||
    elementRect.left < documentRect.left ||
    elementRect.right > documentRect.right;
}

const getPosition = ({ passedPlacement, tooltipElement, toResetPosition }): Position => {
  const {
    orientation
  } = passedPlacement;

  const currentPosition = tooltipElement['_instance'].state.fui?.placement;
  if (!currentPosition){
    return passedPlacement.position;
  }

  if (!toResetPosition) return currentPosition;
  if (isElementOverflowingDocument(tooltipElement)) {
    console.log('tooltip overflown')
    if (orientation === 'auto') {
      return 'auto';
    }
  } else {
    // console.log('tooltip not overflown')
  }
  return currentPosition;
}

const renderTooltip = ({ fui, newlyShown, scrollIntoView, hideOnReferenceHidden, hideOnTooltipEscape, tooltipElement, arrowElement, target, toHide, showOnCreate, arrowSizeScale }) => {
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
    console.log(`size scale: ${arrowSizeScale}`)
    console.log(`arrow size: ${TIP_SIZE}`)

    const staticSide = TIP_SIDES_MAP[placement.split("-")[0]];
    let staticSideTipSizeMultiplier: string | number = 0;
    let top: string | number = 0;
    let left: string | number = 0;
    left = arrowX !== null ? `${arrowX + (TIP_SIZE)}px` : "";

    switch(staticSide) {
      case 'top':
        staticSideTipSizeMultiplier = 1/1.7;
        staticSideTipSizeMultiplier = 1/2;
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
        staticSideTipSizeMultiplier = 1;
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
      width: `${TIP_SIZE}px`,
      height: `${TIP_SIZE}px`,
      [staticSide]: `-${TIP_SIZE*staticSideTipSizeMultiplier}px`
    });
}

const computeTooltip = async ({ passedPlacement, toResetPosition, passedOffset, resetPlacementOnUpdate, newlyShown, toShift, toShowArrow, arrowElement, tooltipElement, target }) => {

  const position = getPosition({
    passedPlacement,
    tooltipElement,
    toResetPosition
  });

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
  toResetPosition: boolean | undefined,
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
  const newlyShown = !tooltipElement['_instance'].getState().fui;


  if(!target) {
    return console.warn('target element not found');
  }

  let fui = await computeTooltip({ passedPlacement, toResetPosition, passedOffset, resetPlacementOnUpdate, toShift, toShowArrow, arrowElement, tooltipElement, target, newlyShown });

  renderTooltip({ fui, newlyShown, scrollIntoView, hideOnReferenceHidden, hideOnTooltipEscape, tooltipElement, arrowElement, target, toHide, showOnCreate, arrowSizeScale });

  setState({
    fui
  });
  return fui;
}

export default floatingUITooltip;
