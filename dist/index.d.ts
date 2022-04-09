import { Props, Instance } from './types';
declare function createTooltip(reference: HTMLElement, props: Partial<Props>): Promise<Instance>;
export default createTooltip;
