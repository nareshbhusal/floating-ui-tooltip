import { onTransitionEnd, getTransitionState, setTransitionState, setElementVisibility } from './utils';
import { Visibility, TransitionState } from './types';

const setTooltipVisibilityState = (tooltipElement: HTMLDivElement, visibility: Visibility): void => {
  const instance = tooltipElement['_instance'];
  instance.setState({
    isShown: visibility === 'visible'
  });
}

let timeout: any;

const clearQueue = (timeout: any) => clearTimeout(timeout);

const queue = (tooltipElement: HTMLDivElement, newVisibilityState: VisibilityState, updateDebounce: number): void => {
  const timeoutDuration = updateDebounce || 100;

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    setTooltipVisibility(tooltipElement, newVisibilityState);
  }, timeoutDuration);
}


export default function setTooltipVisibility(tooltipElement: HTMLDivElement, newVisibilityState: VisibilityState) {
  clearQueue(timeout);
  const instance = tooltipElement['_instance'];
  const updateDebounce = instance.props.updateDebounce;
  const currentTransitionState: TransitionState = getTransitionState(tooltipElement);

  /* console.log('``````````')
  console.log('\n')
  console.log(newVisibilityState, currentTransitionState); */

  if (newVisibilityState === 'visible') {
    if (currentTransitionState === 'shown' || currentTransitionState === 'showing') {
      // console.log(`already ${currentTransitionState}`)
      return;

    } else if (currentTransitionState === 'hidden') {
      // console.log('showing')
      setTransitionState(tooltipElement, 'showing');
      // proceed to show

    } else if (currentTransitionState === 'hiding') {
      // console.log(`cancelling ${currentTransitionState}`)
      queue(tooltipElement, newVisibilityState, updateDebounce);
      return;
    }
  } else {
    if (currentTransitionState === 'hidden' || currentTransitionState === 'hiding') {
      // console.log(`already ${currentTransitionState}`)
      return;

    } else if (currentTransitionState === 'shown') {
      setTransitionState(tooltipElement, 'hiding');
      instance.props.onHide(instance);
      // proceed to hide

    } else if (currentTransitionState === 'showing') {
      // console.log(`cancelling ${currentTransitionState}`)
      queue(tooltipElement, newVisibilityState, updateDebounce);
      return;
    }
  }
  const newTransitionState = newVisibilityState === 'visible' ? 'shown' : 'hidden';

  if (instance.transitionDuration !== 0) {
    onTransitionEnd(tooltipElement, () => {
      setTooltipVisibilityState(tooltipElement, newVisibilityState);
      setTransitionState(tooltipElement, newTransitionState);

      newVisibilityState === 'visible' && instance.props.onShow(instance);
      /* if (LAST_VISIBILITY_STATE) {
        console.log('LAST EVENT FIRED')
        setTooltipVisibility(tooltipElement, LAST_VISIBILITY_STATE);
      } */
    });

    setElementVisibility(tooltipElement, newVisibilityState);
  } else {
    setElementVisibility(tooltipElement, newVisibilityState);
    setTransitionState(tooltipElement, newTransitionState);
    newVisibilityState === 'visible' && instance.props.onShow(instance);
  }
  // for hiding: run onHide hook before dom change
  // for showing: make dom change before running onShow
}
