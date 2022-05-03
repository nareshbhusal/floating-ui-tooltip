import { onTransitionEnd, getTransitionState, setTransitionState, setElementVisibility } from './utils';
import { Visibility, TransitionState } from './types';

function setTooltipVisibilityState(tooltipElement: HTMLDivElement, visibility: Visibility) {
  const instance = tooltipElement['_instance'];
  instance.setState({
    isShown: visibility === 'visible'
  });
}

// console.log = () => {}

// TODO: Any way to preserve the latest caught method call and to plug it at the end in onTransitionEnd callback?
// -- [IMPORTANT]
let LAST_VISIBILITY_STATE: VisibilityState | '' = '';
// TODO: Maybe just try running this as a debounce method
// -- debounce method runs the last call right?
// TODO: This mechanics means ignoring the last call a lot of the times

export default function setTooltipVisibility(tooltipElement: HTMLDivElement, newVisibilityState: VisibilityState) {
  const instance = tooltipElement['_instance'];
  const currentTransitionState: TransitionState = getTransitionState(tooltipElement);

  console.log('``````````')
  console.log('\n')
  console.log(newVisibilityState, currentTransitionState);

  if (newVisibilityState === 'visible') {
    if (currentTransitionState === 'shown' || currentTransitionState === 'showing') {
      console.log(`already ${currentTransitionState}`)
      return;

    } else if (currentTransitionState === 'hidden') {
      console.log('showing')
      LAST_VISIBILITY_STATE = '';
      setTransitionState(tooltipElement, 'showing');
      // proceed to show

    } else if (currentTransitionState === 'hiding') {
      console.log(`cancelling ${currentTransitionState}`)
      LAST_VISIBILITY_STATE = newVisibilityState;
      // NOTE: where should this be again?^
      return;
    }
  } else {
    if (currentTransitionState === 'hidden' || currentTransitionState === 'hiding') {
      console.log(`already ${currentTransitionState}`)
      return;

    } else if (currentTransitionState === 'shown') {
      LAST_VISIBILITY_STATE = '';
      setTransitionState(tooltipElement, 'hiding');
      instance.props.onHide(instance);
      // proceed to hide

    } else if (currentTransitionState === 'showing') {
      console.log(`cancelling ${currentTransitionState}`)
      LAST_VISIBILITY_STATE = newVisibilityState;
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
