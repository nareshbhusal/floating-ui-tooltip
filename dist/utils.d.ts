import { Visibility, TransitionState } from './types';
export declare function doesElementHasTransition(element: HTMLElement): boolean;
export declare function updateTransitionEndListener(root: HTMLDivElement, action: 'add' | 'remove', listener: (event: TransitionEvent) => void): void;
export declare function setTransitionState(element: HTMLDivElement, state: TransitionState): void;
export declare function getTransitionState(element: HTMLDivElement): TransitionState;
export declare function setElementVisibility(tooltipElement: HTMLDivElement, newVisibilityState: Visibility): void;
export declare function onTransitionEnd(element: HTMLDivElement, callback: Function): void;
export declare function scrollElementIntoView(element: HTMLElement): void;
