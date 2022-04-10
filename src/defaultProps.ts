import { Instance } from './types';

const defaultProps = {
  allowHTML: true,
  content: '',
  arrow: true,
  transitionDuration: [300, 250],
  offset: [10, 0],
  hideOnClick: true, // `true` for anywhere outside the tooltip to hide it, 'target' for only when the target is clicked
  onClickOutside: (instance: Instance, event: MouseEvent) => {},
  placement: 'top',
  resetPlacementOnUpdate: false,
  hideOnTooltipEscape: true,
  hideOnReferenceHidden: true,
  maxWidth: 350,
  updateDebounce: 100,
  zIndex: 9999,
  arrowSizeScale: 1,
  updateOnEvents: 'resize scroll'
}

export default defaultProps;
