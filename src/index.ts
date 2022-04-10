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
  }

  public async create() {
    const toHide = false;
    this.tooltipElement = createTooltipElement();
    this.tooltipElement.style.transitionDuration = this.props.transitionDuration[0];
    const { content: contentBox } = getChildren(this.tooltipElement);
    const { allowHTML, content } = this.props;
    if (allowHTML) {
      contentBox.innerHTML = content;
    } else {
      contentBox.innerText = `${content}`;
    }
    window['getChildren'] = getChildren;

    console.log(this.tooltipElement);

    document.body.appendChild(this.tooltipElement);
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

  public getState() {
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
    this.tooltipElement.style.transitionDuration = this.props.transitionDuration[0];
  }

  public show() {
    this.toHideTooltip = false;
    this.update(false);
    this.tooltipElement.style.transitionDuration = this.props.transitionDuration[1];
  }

  public remove() {
    this.tooltipElement.remove();
    this.state = {
      isShown: false,
      isRemoved: true,
      fui: undefined
    }
    this.autoUpdateCleanup();
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
