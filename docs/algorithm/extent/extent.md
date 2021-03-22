# `Extent`

## Creation

An `Extent` represents a map extent. It is created from a `L.LatLngBounds`:

```typescript
const extent = new Extent((bounds: L.LatLngBounds));
```

A new Extent takes in a bounds object, and refits those bounds to the bounds of the tiles that fit inside it from a standard Web Mercator Tile Layer:

On extent creation, the tiles that fit within that extent are listed using [xyz-affair](https://github.com/veltman/xyz-affair):

![Screenshot](fs-extent-with-tiles.png){: width=300px }

The extent's bounds are set as the bounds of the tiles that fit in the L.LatLngBounds fed to `new Extent`:

![Screenshot](fs-extent-refit.png){: width=320px }

## Data fetching

Once created, `extent.fetchData()` can be called, which will fetch all data sources for the extent.
