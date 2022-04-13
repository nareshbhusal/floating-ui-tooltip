export declare function doesElementHasTransition(element: HTMLElement): boolean;
export declare function updateTransitionEndListener(root: HTMLDivElement, action: 'add' | 'remove', listener: (event: TransitionEvent) => void): void;
export declare function onTransitionEnd(element: HTMLDivElement, callback: Function): void;
export declare function scrollElementIntoView(element: HTMLElement): void;
