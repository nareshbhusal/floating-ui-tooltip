import { computePosition, flip, shift, offset, arrow, autoPlacement, hide } from '@floating-ui/dom';
import addCSS from './addCSS';

const addStyles = () => {

  const styles = document.createElement('style');
  styles.innerText = `
  #tooltip h3 {
    text-align: center;
  }
  #tooltip p {
    color: blue;
  }
  #tooltip button {
    border: 1px solid #ccc;
    background: #eee;
  }
  `;
  document.head.appendChild(styles);
}

// TODO: Ability to import js bundle without the css
// TODO: Use debounce to prevent multiple calls for the same event
// TODO: See all the events and hooks tippyjs uses

const SCREEN_EDGE_MARGIN = 16;
const TIP_EDGE_MARGIN = 16;
const TIP_SIZE = 12;
const TIP_WIDTH = Math.sqrt(2 * TIP_SIZE ** 2) / 2;

const TIP_SIDES_MAP = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};

export const createTooltip = async ({ PLACEMENT, OFFSET, tooltip, tip, target, toFlip=true, toShift=true }) => {
  console.log(`toFlip: ${toFlip}`);

  if(!target) return;
  const { x, y, placement, middlewareData } = await computePosition(target, tooltip, {
    placement: PLACEMENT,
    middleware: [
      offset({
        mainAxis: OFFSET[0],
        crossAxis: OFFSET[1]
      }),
      ...PLACEMENT === 'auto' ? [
        autoPlacement(),
      ]: [],
      ...toShift ? [
        shift({ padding: SCREEN_EDGE_MARGIN }),
      ]: [],
      ...PLACEMENT !== 'auto' && toFlip ? [
        flip({
          fallbackPlacements: ['right', 'left'],
          fallbackStrategy: 'initialPlacement' // or `bestFit` (when no placement fits perfectly)
        })
      ]: [],
      arrow({
        element: tip,
        padding: 2,
      }),
      hide()
    ]
  });

  const { referenceHidden } = middlewareData.hide!;
  console.log(`is hidden: ${referenceHidden}`)
  console.log(middlewareData)

  let arrowX,
  arrowY;
  if(middlewareData.arrow){
    arrowX = middlewareData.arrow.x;
    arrowY = middlewareData.arrow.y;
  }

  Object.assign(tooltip.style, {
    visibility: referenceHidden ? 'hidden' : 'visible',
    left: `${x+TIP_SIZE/2}px`, //test
    top: `${y}px`
  });

  const staticSide = TIP_SIDES_MAP[placement.split("-")[0]];
  let staticSideTipSizeMultiplier;
  let top;
  let left;
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
  Object.assign(tip.style, {
    left,
    top,
    right: "",
    bottom: "",
    [staticSide]: `-${TIP_SIZE*staticSideTipSizeMultiplier}px`
  });
}

const renderTooltip = () => {
  console.log('this is tooltip lib')
  const PLACEMENT = "right";
  const OFFSET = [10, 0];


  // const target = document.querySelector("button.chakra-button");
  const target = document.querySelector("button#menu-button-2");
  // const target = document.querySelectorAll("div.chakra-stack")[3];
  // const target = document.querySelector("select");
  const tip = document.createElement("div");
  const tooltipContent = document.createElement("div");
  const tooltip = document.createElement("div");
  addCSS();
  addStyles();

  tooltipContent.innerHTML = `
  <div id="tooltip-container">
  <h3>Tooltip Heading</h3>
  <!--
    <p>This is tooltip body text</p>
  -->
  <button onclick="window.greet()">Click Me!</button>
  </div>
  `;

  tip.id = "tip";
  tooltip.id = "tooltip";
  tooltip.setAttribute('role', 'tooltip');
  // tooltipContent.innerText = `My tooltip`;
  tooltip.appendChild(tip);
  tooltip.appendChild(tooltipContent);

  tooltip.classList.add('popover');
  tooltipContent.classList.add('popover-content');
  tip.classList.add('popover-arrow');
  Object.assign(tooltip.style, {
    visibility: 'hidden',
    top: 0,
    left: 0
  });

  document.body.appendChild(tooltip);

  window.setTimeout(async() => {
    await createTooltip({ PLACEMENT, OFFSET, target, tip, tooltip });
  }, 1000);
  window.addEventListener('resize', async () => {
    await createTooltip({ PLACEMENT, OFFSET, target, tip, tooltip, toFlip: false, toShift: false });
  });
  window.addEventListener('scroll', async () => {
    await createTooltip({ PLACEMENT, OFFSET, target, tip, tooltip, toFlip: false, toShift: false });
  });
};

export default renderTooltip;
