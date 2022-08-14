# floating-ui-tooltip

A tooltip creation library built on top of [floating-ui](https://github.com/floating-ui/floating-ui "floating-ui") (unofficial)

## Installation

```bash
npm install floating-ui-tooltip
```

## Usage
```typescript
import floatingTooltip from 'floating-ui-tooltip';

//...
const props = {
    content: 'tooltip body',
    // ...
}
const tooltipInstance = floatingTooltip(target, props);
```

`floatingTooltip` takes 2 arguments: target (type: `HTMLElement`) and props (type: `Props`)
`target` is the HTML element we want the tooltip on.


### Props
Props is an object with the following properties:

#### `allowHTML`
Type: `boolean`

Default: `true`

#### `content`
Type: `string` | `Element`

Default: `''`

#### `arrow`
Type: `boolean`

Default: `true`

#### `transitionDuration`
Type: `number` | `[number | null, number | null]`

Default: `[300, 250]`

#### `offset`
Type: `[number | undefined, number | undefined]`

Default: `[0, 0]`

#### `factorArrowInOffset`
Type: `boolean`

Default: `true`

#### `hideOnClick`
Type: `boolean`

Default: `true`

#### `onClickOutside()`
Type: `(instance: Instance, event: MouseEvent) => void`

Default: `(instance: Instance, event: MouseEvent) => {}`

#### `onShow()`
Type: `(instance: Instance) => void`

Default: `(instance: Instance) => {}`

#### `onHide`
Type: `(instance: Instance) => void`

Default: `(instance: Instance) => {}`


#### `onStateChange()`
Type: `(oldState: TooltipState, newState: Partial<TooltipState>) => void`

Default: `(oldState: TooltipState, newState: Partial<TooltipState>) => {}`

#### `onRemove()`
Type: `() => void`

Default: `() => {}`

#### `onBeforeFirstRender()`
Type: `() => void`

Default: `() => {}`

#### `onAfterFirstRender()`
Type: `() => void`

Default: `() => {}`

#### `placement`
Type: `Placement`

```typescript
type Position = FUIPlacement | 'auto';
type Orientation = 'fixed' | 'auto';

type Placement = {
  position: Position;
  orientation: Orientation;
}
```

Default:
```typescript
{
    position: 'top',
    orientation: 'fixed'
}
```


#### `resetPlacementOnUpdate`
Type: `boolean`

Default: `false`

#### `hideOnTooltipEscape`
Type: `boolean`

Default: `true`

#### `hideOnReferenceHidden`
Type: `boolean`

Default: `true`

#### `showOnCreate`
Type: `boolean`

Default: `true`

#### `scrollIntoView`
Type: `boolean`

Default: `false`

#### `maxWidth`
Type: `number`

Default: `350`

#### `arrowSizeScale`
Type: `number`

Default: `1`

#### `updateDebounce`
Type: `number`

Default: `100`

#### `zIndex`
Type: `number`

Default: `99999`

#### `updateOnEvents`
Type: `number`

Default: `resize scroll`

<hr></hr>

### Instance

Instance object that's returned by calling the tooltip method.

```typescript
type Instance = {
  props: Props;
  reference: HTMLElement;
  tooltipElement: HTMLElement;
  getState: () => TooltipState;
  show: (toResetPosition?: boolean) => void;
  hide: () => void;
  remove: () => void;
  update: () => void;
}

type TooltipState = {
  isShown: boolean;
  isRemoved: boolean;
  fui: ComputePositionReturn | undefined;
}
```

#### `props`
Properties associated with the tooltip, passed and calculated

#### `reference`
The target element of the tooltip

#### `tooltipElement`
Dom element representating the tooltip

#### `getState()`
Method that returns the state object of the tooltip element

##### `isShown`
`true` if the tooltip is visible

##### `isRemoved`
`true` if the tooltip has been removed from the dom

##### `fui`
`fui` is the `floating-ui` instance

#### `show(toResetPosition?: boolean)`
Turns visibility on for tooltip, setting `isShown` state property to `true`.

#### `hide()`
Hides the tooltip. Sets `isShown` to `false`

#### `remove()`
Removes the tooltip from the dom. Sets `isRemoved` state property to `true`

#### `update()`

## In use by

**[Lusift](https://github.com/lusift/lusift)**


## License

[MIT](https://github.com/lusift/lusift/blob/main/LICENSE "MIT")
