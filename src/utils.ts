
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

  // some browsers apparently support `transition` (unprefixed) but only fire
  // `webkitTransitionEnd`...
  [
    'transitionend',
    'webkitTransitionEnd',
    'oTransitionEnd'
  ].forEach((event) => {
    root[method](event, listener as EventListener);
  });
}

export function onTransitionEnd(element: HTMLDivElement, callback: Function) {

    function listener(e) {
      if(e.target === element) {
        updateTransitionEndListener(<HTMLDivElement>element, 'remove', listener);
        callback();
        console.log("transition end for event "+ e);
      }
    }
    // TODO: Any way to get list of event listeners attached to an element?
    // TODO: Any way to run the callback only once, because all of the events fire apprently
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
