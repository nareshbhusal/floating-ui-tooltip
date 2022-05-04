import createTooltipElement, { getChildren } from './tooltip-element';
import addCSS from './addCSS';
import { Props, TooltipState, Instance } from './types';
import floatingUITooltip from './floating-ui-tooltip';
import defaultProps from './defaultProps';
import debounce from './debounce';
import { autoUpdate } from '@floating-ui/dom';

import { DEFAULT_TIP_SIZE } from './constants';
export const DEFAULT_ARROW_SIZE = DEFAULT_TIP_SIZE;

// TODO: Ability to import js bundle without the css

const appendTo = () => document.body;

class Tooltip {
  readonly props: Props;
  readonly reference: HTMLElement;
  public tooltipElement!: HTMLDivElement;
  private state: TooltipState = {
    isShown: false,
    isRemoved: false,
    fui: undefined
  }
  private updateListenerCleanup: () => void = () => {};
  private toHideTooltip: boolean = false;
  private debouncedUpdate!: (arg: boolean | undefined) => void;
  private transitionDuration: number = 0;

  constructor(props: Props, target: HTMLElement) {
    this.props = props;
    // this.props.updateDebounce = 0; // test
    this.reference = target;
    window['tp'] = this;
    addCSS();
    this.toHideTooltip = !this.props.showOnCreate;
  }

  private hookEventListeners() {
    this.debouncedUpdate = debounce(
      this.update.bind(this),
      this.props.updateDebounce
    );
    const autoUpdateCleanup = autoUpdate(
      this.reference,
      this.tooltipElement,
      () => this.debouncedUpdate(undefined),
    );

    const debouncedUpdateHandler = () =>
      this.debouncedUpdate(undefined) as unknown as EventListenerOrEventListenerObject;

    this.props.updateOnEvents.split(' ').forEach(event => {
      window.addEventListener(
        <keyof WindowEventMap>event,
        debouncedUpdateHandler
      );
    });
    window.addEventListener('click', this.clickHandler.bind(this));

    // prepare event listeners' cleanup method
    this.updateListenerCleanup = () => {
      autoUpdateCleanup();
      window.removeEventListener('click', this.clickHandler.bind(this));

      this.props.updateOnEvents.split(' ').forEach(event => {
        window.removeEventListener(
          <keyof WindowEventMap>event,
          debouncedUpdateHandler
        );
      });
    }
  }

  private clickHandler = (event: MouseEvent) => {
    if (!this.state.isShown) return;

    // if click is outside of tooltip and reference
    if (
      !this.tooltipElement.contains(event.target as Node) &&
      !this.reference.contains(event.target as Node)
    ) {
      if (this.props.onClickOutside) {
        this.props.onClickOutside(this, event);
      }
    }

    if (this.props.hideOnClick === 'target') {
      if (event.target === this.reference) {
        this.hide();
      }
    } else if (this.props.hideOnClick) {
      this.hide();
    }
  }

  private updateTransitionDuration(duration: number) {
    this.transitionDuration = duration;
    this.tooltipElement.style.transitionDuration = `${duration}ms`;
  }

  public async create() {
    this.tooltipElement = createTooltipElement(this);
    this.updateTransitionDuration(
      this.props.transitionDuration[this.toHideTooltip ? 0 : 1]
    );
    const { content: contentBox } = getChildren(this.tooltipElement);
    const { allowHTML, content } = this.props;
    if (allowHTML) {
      if (content instanceof Element) {
        contentBox.appendChild(content);
      } else {
        contentBox.innerHTML = content;
      }
    } else {
      if (!(content instanceof Element)) {
        contentBox.innerText = content;
      }
    }

    appendTo().appendChild(this.tooltipElement);
    this.props.onBeforeFirstRender();

    const initFloatingUI = async () => {
      await floatingUITooltip(
        this.props,
        this.tooltipElement,
        this.reference,
        this.toHideTooltip,
        true,
        this.setState.bind(this),
      );
      await this.update(false, true);
      await this.update(false, true);
      this.hookEventListeners();
    }
    await initFloatingUI();
    if(this.props.showOnCreate){
      await this.show();
    } else {
      await this.hide();
    }
    this.props.onAfterFirstRender();
  }

  public getState(): TooltipState {
    return this.state;
  }

  private setState(newState: Partial<TooltipState>) {
    const visibilityChanged = typeof newState.isShown !== 'undefined' &&
      newState.isShown !== this.state.isShown;

    if (visibilityChanged) {
      this.updateTransitionDuration(
        this.props.transitionDuration[newState.isShown ? 1 : 0]
      );
    }

    this.props.onStateChange(this.state, newState);

    this.state = {
      ...this.state,
      ...newState
    }
  }

  public async update(toHide?: boolean, toResetPosition?: boolean) {
    toHide = toHide || this.toHideTooltip || false;
    await floatingUITooltip(
      this.props,
      this.tooltipElement,
      this.reference,
      toHide,
      toResetPosition,
      this.setState.bind(this)
    );
  }

  public async hide() {
    // hide() when tooltip is already hidden should prevent event listeners
    // from showing tooltip without before running show() manually
    this.toHideTooltip = true;
    await this.update(true);
  }

  public async show() {
    // console.log(`show() ran with resetPosition: ${resetPosition}`);
    this.toHideTooltip = false;
    await this.update(false);
  }

  public remove() {
    this.tooltipElement.remove();
    this.state = {
      isShown: false,
      isRemoved: true,
      fui: undefined
    }
    this.updateListenerCleanup();
    console.log('removed all event listeners and observers');
    this.props.onRemove();
  }
}

function isElementInViewport (el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
  );
}

async function createTooltip(
  reference: HTMLElement,
  props: Partial<Props>
): Promise<Instance> {
  const placement = props.placement || defaultProps.placement;
  const transitionDuration = props.transitionDuration || defaultProps.transitionDuration;
  const offset = props.offset || defaultProps.offset;

  // NOTE: Interesting that the properties with undefined values still won't be replaced...
  // -- Relevant to Lusift?

  // remove properties with value of undefined
  Object.keys(props).forEach(key => props[key] === undefined && delete props[key])

  const allProps: Props = {
    ...defaultProps,
    ...props,
    placement: <Props['placement']>placement,
    transitionDuration: <Props['transitionDuration']>transitionDuration,
    offset: <Props['offset']>offset,
  };
  allProps.factorArrowInOffset = allProps.arrow && allProps.factorArrowInOffset;

  if (allProps.factorArrowInOffset) {
    const arrowSize = allProps.arrowSizeScale * DEFAULT_ARROW_SIZE;
    allProps.offset[0] = allProps.offset[0]! + (arrowSize * Math.sqrt(2) / 2);
  }
  const tooltipInstance = new Tooltip(allProps, reference);

  await tooltipInstance.create();

  const instance: Instance = {
    props: tooltipInstance.props,
    reference: tooltipInstance.reference,
    tooltipElement: tooltipInstance.tooltipElement,
    getState: tooltipInstance.getState.bind(tooltipInstance),
    show: tooltipInstance.show.bind(tooltipInstance),
    hide: tooltipInstance.hide.bind(tooltipInstance),
    remove: tooltipInstance.remove.bind(tooltipInstance),
    update: tooltipInstance.update.bind(tooltipInstance),
  }

  return instance;
}

export default createTooltip;
