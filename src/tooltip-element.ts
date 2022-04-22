import { setTransitionState, setElementVisibility } from './utils';

export const NODE_CLASSNAME_PREFIX = 'floating-ui-tooltip';

export function div(): HTMLDivElement {
  return document.createElement('div');
}

const createTooltipElement = (instanceEnv): HTMLDivElement => {

  const tooltipRoot = div();
  const tooltipBox = div();
  const tooltipContent = div();
  const arrowElement = div();

  tooltipRoot.className = `${NODE_CLASSNAME_PREFIX}-root`;
  tooltipBox.className = `${NODE_CLASSNAME_PREFIX}-box`;
  tooltipContent.className = `${NODE_CLASSNAME_PREFIX}-content`;
  arrowElement.className = `${NODE_CLASSNAME_PREFIX}-arrow`;

  tooltipBox.appendChild(tooltipContent);
  tooltipBox.appendChild(arrowElement);
  tooltipRoot.appendChild(tooltipBox);

  Object.assign(tooltipContent.style, {
    maxWidth: `${instanceEnv.props.maxWidth}px`
  })
  tooltipContent.innerHTML = `
    <div id="tooltip-container">
    <h3>Default tooltip</h3>
    </div>
  `;

  tooltipBox.setAttribute('role', 'tooltip');
  setElementVisibility(tooltipRoot, 'hidden');
  setTransitionState(tooltipRoot, 'hidden');

  Object.assign(tooltipRoot.style, {
    zIndex: instanceEnv.props.zIndex,
    visibility: 'hidden',
    left: `0px`,
    top: `0px`
  });
  tooltipRoot['_instance'] = instanceEnv;
  return tooltipRoot;
}


export interface TooltipElementChildren {
  box: HTMLDivElement;
  content: HTMLDivElement;
  arrow: HTMLDivElement;
}

export function getChildren(tooltipElement: Element): TooltipElementChildren {
  return {
    box: tooltipElement.querySelector(`.${NODE_CLASSNAME_PREFIX}-box`)!,
    content: tooltipElement.querySelector(`.${NODE_CLASSNAME_PREFIX}-content`)!,
    arrow: <HTMLDivElement>tooltipElement.querySelector(`.${NODE_CLASSNAME_PREFIX}-arrow`) || undefined
  };
}

export default createTooltipElement;
