export const NODE_CLASSNAME_PREFIX = 'floating-ui-tooltip';

export function div(): HTMLDivElement {
  return document.createElement('div');
}

const createTooltipElement = (): HTMLElement => {

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

  tooltipContent.innerHTML = `
    <div id="tooltip-container">
    <h3>Default tooltip</h3>
    </div>
  `;

  tooltipBox.setAttribute('role', 'tooltip');
  tooltipRoot.setAttribute('data-state', '');
  Object.assign(tooltipRoot.style, {
    visibility: 'hidden',
    left: `0px`,
    top: `0px`
  });
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
