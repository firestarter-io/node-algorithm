# `BurnMatrix`

## Creation

A `BurnMatrix` belongs to an `Extent`. It is a mathematical abstraction representing all the pixels in an extent. A `BurnExtent` is a [Mathjs sparse matrix](https://mathjs.org/docs/datatypes/matrices.html) whose size is the same as the size of the `Extent`. For example, an `Extent` that is 3 tiles wide by 2 tiles tall, with a tilesize of 256 pixels, will have a `BurnMatrix` of size `[256 * 3, 256 * 2]`.

A `BurnMatrix` is created and associated with an extent when a `new Extent` is created. The `Extent` is also available from the `BurnMatrix` - there is always a 1 to 1 relationship, meaning `Extents` won't share a `BurnMatrix`, and vice versa.

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
