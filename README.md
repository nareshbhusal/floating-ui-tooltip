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

#### `content`
Type: `string` | `Element`

Default: `''`

Content for tooltip element.

#### `allowHTML`
Type: `boolean`

Default: `true`

If to append `content` as an HTML element to the tooltip.


#### `arrow`
Type: `boolean`

Default: `true`

Whether we want an arrow from tooltip pointing to the target element.

#### `transitionDuration`
Type: `number` | `[number | null, number | null]`

Default: `[300, 250]`

First item in the array is the CSS property `transition-duration` when hiding the tooltip and second is when showing it.

#### `offset`
Type: `[number | undefined, number | undefined]`

Default: `[0, 0]`


Offset's data type is an array of 2 numbers, the first number is the distance of the tooltip from x-axis of the element, and the second number is the distance of tooltip from y-axis of the target element.


#### `factorArrowInOffset`
Type: `boolean`

Default: `true`

When set to `true`, the offset will be the one passed in `offset` combined with the size of the arrow element.

#### `hideOnClick`
Type: `boolean` | `target`

Default: `true`

If set to `true`: Clicking anywhere on the dom will hide the tooltip
If set to `target`: Clicking on tooltip element will hide the tooltip

#### `onClickOutside()`
Type: `(instance: Instance, event: MouseEvent) => void`

Default: `(instance: Instance, event: MouseEvent) => {}`

Runs when click event is registered outside the tooltip or the reference element.

#### `onShow()`
Type: `(instance: Instance) => void`

Default: `(instance: Instance) => {}`

Runs when tooltip is shown.

#### `onHide()`
Type: `(instance: Instance) => void`

Default: `(instance: Instance) => {}`

Runs when tooltip is hidden.

#### `onStateChange()`
Type: `(oldState: TooltipState, newState: Partial<TooltipState>) => void`

Default: `(oldState: TooltipState, newState: Partial<TooltipState>) => {}`

Method that runs on tooltip state change.

#### `onRemove()`
Type: `() => void`

Default: `() => {}`

Method that runs on calling the `remove()` method on tooltip.

#### `onBeforeFirstRender()`
Type: `() => void`

Default: `() => {}`

Runs right before the tooltip is created in the dom.

#### `onAfterFirstRender()`
Type: `() => void`

Default: `() => {}`

Runs right after the tooltip is created in the dom.

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

##### `Position`
`position` dictates where the tooltip should be positioned with respect to the target dom element. The default value is bottom.

##### `Orientation`
Setting `orientation` to auto will make Lusift change the position of the tooltip if the tooltip overflows the document when rendered with the passed position value. Setting it to fixed prevents this behaviour. Default value is auto.


#### `resetPlacementOnUpdate`
Type: `boolean`

Default: `false`

#### `hideOnTooltipEscape`
Type: `boolean`

Default: `true`

If set to `true`, the tooltip will dissapear when it is out of the viewport.

#### `hideOnReferenceHidden`
Type: `boolean`

Default: `true`

If set to `true`, the tooltip will dissapear when the target element is out of the viewport.

#### `showOnCreate`
Type: `boolean`

Default: `true`

On `true`, the tooltip will show upon creation.

#### `scrollIntoView`
Type: `boolean`

Default: `false`

When set to `true` the document will scroll to the target element on the screen.

#### `maxWidth`
Type: `number`

Default: `350`

Maximum width of the tooltip.

#### `arrowSizeScale`
Type: `number`

Default: `1`

`arrowSizeScale` is the multiple value you want to increase the tooltip arrow's size by.


#### `updateDebounce`
Type: `number`

Default: `100`

Set a limit to how frequently the update method can be triggered. Unit is milliseconds.

#### `zIndex`
Type: `number`

Default: `99999`

z-index of the tooltip element.

#### `updateOnEvents`
Type: `number`

Default: `resize scroll`

Events seperated by spaces that should trigger tooltip update.

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

#### `show()`
Turns visibility on for tooltip, setting `isShown` state property to `true`.

#### `hide()`
Hides the tooltip. Sets `isShown` to `false`

#### `remove()`
Removes the tooltip from the dom. Sets `isRemoved` state property to `true`

#### `update()`
Trigger the tooltip to update it's position for anchor or target element.

## In use by

**[Lusift](https://github.com/lusift/lusift)**


## License

[MIT](https://github.com/lusift/lusift/blob/main/LICENSE "MIT")
