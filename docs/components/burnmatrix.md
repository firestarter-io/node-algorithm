# `BurnMatrix`

## Creation

A `BurnMatrix` belongs to an `Extent`. It is a mathematical abstraction representing all the pixels in an extent. A `BurnExtent` is a [MathJS SparseMatrix](https://mathjs.org/docs/reference/classes/sparsematrix.html) whose size is the same as the size of the `Extent`. For example, an `Extent` that is 3 tiles wide by 2 tiles tall, with a tilesize of 256 pixels, will have a `BurnMatrix` of size `[256 * 3, 256 * 2]`.

A `BurnMatrix` is created and associated with an extent when a `new Extent` is created. The `Extent` is also available from the `BurnMatrix` - there is always a 1 to 1 relationship, meaning `Extents` won't share a `BurnMatrix`, and vice versa.

A `BurnMatrix` is _dynamic_, meaning its state is constantly changing over the life of the algorithm. Looking at a `BurnMatrix` at one point in time tells you nothing about its state at another point in time. However, a snapshot of the `BurnMatrix` is taken at every `Timestep`, so the evolution of the `BurnMatrix` can be seen by following the trail of its snapshots through an array of `Timesteps`.

## Coordinates

A Mathjs matrix is a wrapped around a javascript array. A 2 dimensional matrix is an array of inner arrays:

```
const matrix = math.zeros(2, 3)

[
	[0, 0, 0],
	[0, 0, 0]
];
```

Note that [the coordinates for all matrix operations are in `[y, x]` format](https://github.com/josdejong/mathjs/issues/2142#issuecomment-805653872). A `BurnMatrix` redefines any necessary matrix methods to use `[x, y]` coordinates for consistency with canvas data methods. For example, [`CanvasRenderingContext2D.getImageData()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData) takes coordinates in `[x, y]` order. This is the reason that certain `BurnMatrix` and `Extent` methods use `[y, x]` coordinates.
