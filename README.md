# sproing

> A minimal physical spring implementation. Can operate on
> a scalar number or an array of numbers.

[![NPM](https://img.shields.io/npm/v/threeact.svg)](https://www.npmjs.com/package/threeact) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Demo

[Demo](https://gpascale.github.io/sproing/example/)

<img src="example-small.gif" width="640">

## Install

```bash
npm install --save sproing
```

## Usage

### Initialization

```javascript
// A scalar spring with initial value 0, target 1, and default spring params
const scalarSproing = new Sproing(0, 1);

// A scalar spring with cutsomized spring param
const vectorSproing = new Sproing([0, 0, 1], {
  springParams: {
    tension: 40,
    damping: 20,
    mass: 2
  }
});
```

### Change target

```javascript
scalarSproing.setTarget(2);

vectorSproing.setTarget([0, 1, 4]);
```

### Update step (call in requestAnimationFrame or similar)

```javascript
const newScalar = scalarSproing.update();
// x

const newVector = vectorSproing.update();
// [ x, y, z ]
```

## License

MIT © [gpascale](https://github.com/gpascale)

[Demo](https://gpascale.github.io/sproing/example/)
