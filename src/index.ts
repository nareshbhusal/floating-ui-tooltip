import createTooltipElement, { getChildren } from './tooltip-element';
import addCSS from './addCSS';
import { Props, TooltipState, Instance } from './types';
import floatingUITooltip from './floating-ui-tooltip';
import defaultProps from './defaultProps';
import debounce from './debounce';
import { autoUpdate } from '@floating-ui/dom';

// TODO: Ability to import js bundle without the css
// TODO: Implement props.maxWidth
// NOTE: Should the tooltip be appended to the body?
// -- https://web.archive.org/web/20210827084020/https://atfzl.com/don-t-attach-tooltips-to-document-body

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
    this.reference = target;
    // window['tp'] = this;
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
    const toHide = !this.props.showOnCreate;
    this.tooltipElement = createTooltipElement(this);
    this.updateTransitionDuration(
      this.props.transitionDuration[toHide ? 0 : 1]
    );
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

  public async hide() {
    // hide() when tooltip is already hidden should prevent event listeners
    // from showing tooltip without before running show() manually
    this.toHideTooltip = true;
    await this.update(true);
  }

  public async show() {
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
