import { onTransitionEnd, getTransitionState, setTransitionState, setElementVisibility } from './utils';
import { Visibility, TransitionState } from './types';

function setTooltipVisibilityState(tooltipElement: HTMLDivElement, visibility: Visibility) {
  const instance = tooltipElement['_instance'];
  instance.setState({
    isShown: visibility === 'visible'
  });
}

// TODO: Any way to preserve the latest caught method call and to plug it at the end in onTransitionEnd callback?

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
      setTransitionState(tooltipElement, 'showing');
      // proceed to show

    } else if (currentTransitionState === 'hiding') {
      console.log(`cancelling ${currentTransitionState}`)
      return;
    }
  } else {
    if (currentTransitionState === 'hidden' || currentTransitionState === 'hiding') {
      console.log(`already ${currentTransitionState}`)
      return;

    } else if (currentTransitionState === 'shown') {
      setTransitionState(tooltipElement, 'hiding');
      instance.props.onHide(instance);
      // proceed to hide

    } else if (currentTransitionState === 'showing') {
      console.log(`cancelling ${currentTransitionState}`)
      return;
    }
  }
  const newTransitionState = newVisibilityState === 'visible' ? 'shown' : 'hidden';

  if (instance.transitionDuration !== 0) {
    onTransitionEnd(tooltipElement, () => {
      setTooltipVisibilityState(tooltipElement, newVisibilityState);
      setTransitionState(tooltipElement, newTransitionState);

      newVisibilityState === 'visible' && instance.props.onShow(instance);
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
