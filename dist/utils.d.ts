export declare function doesElementHasTransition(element: HTMLElement): boolean;
export declare function updateTransitionEndListener(box: HTMLDivElement, action: 'add' | 'remove', listener: (event: TransitionEvent) => void): void;
export declare function onTransitionEnd(element: HTMLElement, callback: Function): void;
