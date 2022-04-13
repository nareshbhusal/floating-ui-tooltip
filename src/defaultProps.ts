import { Instance } from './types';

const defaultProps = {
  allowHTML: true,
  content: '',
  arrow: true,
  scrollIntoView: false,
  transitionDuration: [300, 250],
  offset: [10, 0],
  hideOnClick: true, // `true` for anywhere outside the tooltip to hide it, 'target' for only when the target is clicked
  onClickOutside: (instance: Instance, event: MouseEvent) => {},
  onShow: (instance: Instance) => {},
  onHide: (instance: Instance) => {},
  onRemove: () => {},
  placement: 'top',
  resetPlacementOnUpdate: false,
  hideOnTooltipEscape: true,
  hideOnReferenceHidden: true,
  showOnCreate: true,
  maxWidth: 350,
  updateDebounce: 100,
  zIndex: 99999,
  arrowSizeScale: 1,
  updateOnEvents: 'resize scroll'
}

export default defaultProps;
