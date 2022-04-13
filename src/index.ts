import createTooltipElement, { getChildren } from './tooltip-element';
import addCSS from './addCSS';
import { Props, TooltipState, Instance } from './types';
import floatingUITooltip from './floating-ui-tooltip';
import defaultProps from './defaultProps';
import debounce from './debounce';
import { doesElementHasTransition, onTransitionEnd } from './utils';
import { autoUpdate } from '@floating-ui/dom';

// TODO: Ability to import js bundle without the css
// TODO: Implement props.maxWidth
// NOTE: Should the tooltip be appended to the body?
// -- https://web.archive.org/web/20210827084020/https://atfzl.com/don-t-attach-tooltips-to-document-body

const appendTo = () => document.body;

// TODO: continual scrolling delays the update, for as long as you can keep scrolling, fix that


class Tooltip {
  readonly props: Props;
  readonly reference: HTMLElement;
  private tooltipElement!: HTMLDivElement;
  private state: TooltipState = {
    isShown: false,
    isRemoved: false,
    fui: undefined
  }
  private autoUpdateCleanup!: () => void;
  private toHideTooltip: boolean = false;
  private debouncedUpdate!: (arg: boolean | undefined) => void;
  private transitionDuration: number = 0;

  constructor(props: Props, target: HTMLElement) {
    this.props = props;
    this.reference = target;
    window['tp'] = this;
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

  private updateTransitionDuration(duration: number) {
    this.transitionDuration = duration;
    this.tooltipElement.style.transitionDuration = `${duration}ms`;
  }

  public async create() {
    const toHide = !this.props.showOnCreate;
    this.tooltipElement = createTooltipElement();
    this.updateTransitionDuration(this.props.transitionDuration[0]);
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
    /* console.log(this.props.onShow)
    console.log(this.state.isShown) */
  }

  public getState(): TooltipState {
    return this.state;
  }

  private setState(newState: Partial<TooltipState>) {
    const visibilityChanged = typeof newState.isShown !== 'undefined' &&
      newState.isShown !== this.state.isShown;

    /* if(!visibilityChanged){
      console.log('visibility not changed')
    } else {
      console.log('visibility changed')
    } */

    if (visibilityChanged && newState.isShown){
      const debouncedOnShow = debounce(this.props.onShow, 0);
      if(this.transitionDuration) {
        onTransitionEnd(this.tooltipElement, () => {
          debouncedOnShow(this);
        });
      } else {
        debouncedOnShow(this);
      }
    }

    this.state = {
      ...this.state,
      ...newState
    }

    if(visibilityChanged && !newState.isShown) {
      this.props.onHide(this);
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
    this.updateTransitionDuration(this.props.transitionDuration[0]);
  }

  public async show() {
    // this.props.onShow(this);
    this.toHideTooltip = false;
    await this.update(false);
    this.updateTransitionDuration(this.props.transitionDuration[1]);
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
  // offset needs to be size of the tooltip + backdrop gap (if applicable)

  console.log(props.offset)
  // NOTE: Interesting that the properties with undefined values still won't be replaced...
  // -- keep this in mind for Lusift too


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
    getState: tooltipInstance.getState.bind(tooltipInstance),
    show: tooltipInstance.show.bind(tooltipInstance),
    hide: tooltipInstance.hide.bind(tooltipInstance),
    remove: tooltipInstance.remove.bind(tooltipInstance),
    update: tooltipInstance.update.bind(tooltipInstance),
  }

  return instance;
}

export default createTooltip;
