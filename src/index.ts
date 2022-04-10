import createTooltipElement, { getChildren } from './tooltip-element';
import addCSS from './addCSS';
import { Props, TooltipState, Instance } from './types';
import floatingUITooltip from './floating-ui-tooltip';
import defaultProps from './defaultProps';
import debounce from './debounce';
import { autoUpdate } from '@floating-ui/dom';

// TODO: Ability to import js bundle without the css
// NOTE: Should the tooltip be appended to the body?
// -- https://web.archive.org/web/20210827084020/https://atfzl.com/don-t-attach-tooltips-to-document-body
// TODO: Add onClickOutside method (when clicked outside of the tooltip or reference element)

const appendTo = () => document.body;

function onClickOutside(
  reference: HTMLElement,
  instance: Instance,
  event: MouseEvent
) {
  if (instance.props.hideOnClick === true) {
    instance.hide();
  }
}

class Tooltip {
  readonly props: Props;
  readonly reference: HTMLElement;
  private tooltipElement!: HTMLElement;
  private state: TooltipState = {
    isShown: false,
    isRemoved: false,
    fui: undefined
  }
  private autoUpdateCleanup!: () => void;
  private toHideTooltip: boolean = false;
  private debouncedUpdate!: (arg: boolean | undefined) => void;

  constructor(props: Props, target: HTMLElement) {
    this.props = props;
    this.reference = target;
    addCSS();
  }

  private hookEventListeners() {
    this.debouncedUpdate = debounce(
      this.update.bind(this),
      this.props.updateDebounce
    );
    this.autoUpdateCleanup = autoUpdate(
      this.reference,
      this.tooltipElement,
      () => this.debouncedUpdate(undefined)
    );
    this.props.updateOnEvents.split(' ').forEach(event => {
      window.addEventListener(
        <keyof WindowEventMap>event,
        () => this.debouncedUpdate(undefined) as unknown as EventListenerOrEventListenerObject
      );
    });
    window.addEventListener('click', this.clickHandler.bind(this));
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

  public async create() {
    const toHide = false;
    this.tooltipElement = createTooltipElement();
    this.tooltipElement.style.transitionDuration = this.props.transitionDuration[0]+'ms';
    const { content: contentBox } = getChildren(this.tooltipElement);
    const { allowHTML, content } = this.props;
    if (allowHTML) {
      contentBox.innerHTML = content;
    } else {
      contentBox.innerText = `${content}`;
    }

    appendTo().appendChild(this.tooltipElement);
    await floatingUITooltip(
      this.props,
      this.tooltipElement,
      this.reference,
      toHide,
      true,
      this.setState.bind(this),
    );
    this.hookEventListeners();
  }

  public getState(): TooltipState {
    return this.state;
  }

  private setState(newState: Partial<TooltipState>) {
    this.state = {
      ...this.state,
      ...newState
    }
  }

  public async update(toHide?: boolean) {
    toHide = toHide || this.toHideTooltip || false;
    await floatingUITooltip(
      this.props,
      this.tooltipElement,
      this.reference,
      toHide,
      false,
      this.setState.bind(this)
    );
  }
  public hide() {
    // hide() when tooltip is already hidden should prevent event listeners
    // from showing tooltip without before running show() manually
    this.toHideTooltip = true;
    this.update(true);
    this.tooltipElement.style.transitionDuration = this.props.transitionDuration[0]+'ms';
  }

  public show() {
    this.toHideTooltip = false;
    this.update(false);
    this.tooltipElement.style.transitionDuration = this.props.transitionDuration[1]+'ms';
  }

  public remove() {
    this.tooltipElement.remove();
    this.state = {
      isShown: false,
      isRemoved: true,
      fui: undefined
    }
    this.autoUpdateCleanup();
    window.removeEventListener('click', this.clickHandler.bind(this));
    this.props.updateOnEvents.split(' ').forEach(event => {
      window.removeEventListener(
        <keyof WindowEventMap>event,
        this.debouncedUpdate as unknown as EventListenerOrEventListenerObject
      );
    });
  }
}

async function createTooltip(
  reference: HTMLElement,
  props: Partial<Props>
) {
  const placement = props.placement || defaultProps.placement;
  const transitionDuration = props.transitionDuration || defaultProps.transitionDuration;
  const offset = props.offset || defaultProps.offset;

  const allProps: Props = {
    ...defaultProps,
    ...props,
    placement: <Props['placement']>placement,
    transitionDuration: <Props['transitionDuration']>transitionDuration,
    offset: <Props['offset']>offset,
  };
  const tooltipInstance = new Tooltip(allProps, reference);
  await tooltipInstance.create();

  const instance: Instance = {
    props: tooltipInstance.props,
    reference: tooltipInstance.reference,
    getState: tooltipInstance.getState.bind(tooltipInstance),
    show: tooltipInstance.show.bind(tooltipInstance),
    hide: tooltipInstance.hide.bind(tooltipInstance),
    remove: tooltipInstance.remove.bind(tooltipInstance),
  }

  return instance;
}

export default createTooltip;
