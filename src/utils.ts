import { Visibility, TransitionState } from './types';

export function doesElementHasTransition(element: HTMLElement): boolean {
    function getCSSPropertyValue(element: HTMLElement, property: string): string {
        // not working with firefox, pulling property `transition`
        return window.getComputedStyle(element).getPropertyValue(property);
    }
    const transitionDuration = getCSSPropertyValue(element, "transition-duration");
    return !(transitionDuration === "0s" || transitionDuration === "0ms");
}

export function updateTransitionEndListener(
  root: HTMLDivElement,
  action: 'add' | 'remove',
  listener: (event: TransitionEvent) => void
): void {
  const method = `${action}EventListener` as
  | 'addEventListener'
  | 'removeEventListener';

  [
    'transitionend',
    'webkitTransitionEnd',
    'oTransitionEnd'
  ].forEach((event) => {
    root[method](event, listener as EventListener);
  });
}

export function setTransitionState(element: HTMLDivElement, state: TransitionState) {
  element.setAttribute('data-transition-state', state);
  // console.log('>> new transition state: '+state)
}

export function getTransitionState(element: HTMLDivElement): TransitionState {
  return <TransitionState>element.getAttribute('data-transition-state');
}

export function setElementVisibility(tooltipElement: HTMLDivElement, newVisibilityState: Visibility) {

  tooltipElement.setAttribute('data-state', newVisibilityState);
  Object.assign(tooltipElement.style, {
    visibility: newVisibilityState,
  });
}

export function onTransitionEnd(element: HTMLDivElement, callback: Function) {

  function listener(e) {
    if(e.target === element) {
      updateTransitionEndListener(<HTMLDivElement>element, 'remove', listener);
      try {
        callback();
      } catch (err) {
        console.error(err);
        element['_instance'].props.onHide();
      }
    }
  }
  updateTransitionEndListener(<HTMLDivElement>element, 'remove', listener);
  updateTransitionEndListener(<HTMLDivElement>element, 'add', listener);
}

export function scrollElementIntoView(element: HTMLElement) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
}

export const isDOMElement = el => el instanceof Element
