import { Props, Instance } from './types';
export declare const DEFAULT_ARROW_SIZE = 12;
declare function createTooltip(reference: HTMLElement, props: Partial<Props>): Promise<Instance>;
export default createTooltip;
