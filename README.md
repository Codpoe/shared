# shared

A simple library for creating something shared where you can use events and mount anything you like.

## Install

```
yarn add @toolman/shared
```

## Usage

```js
import shared from '@toolman/shared';

const host = shared

// `on` & `emit`
// Note: `once`, `off` are also supported 
host.on('msg', payload => {
  console.log(payload); // => 'cool'
})

host.emit('msg', 'cool');


// `set` & `get`
host.set('foo', 'bar');

(async () => {
  await host.get('foo'); // => 'bar'
})();
```

That's all.
