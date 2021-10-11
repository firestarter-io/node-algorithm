General notes to self and TODOs

## Optimizations

Notes on potential optimizations to implement.

### Consider using ndarray

Currently a `BurnMatrix` is based on a MathJS SparseMatrix. Another option is the [javascript implementation of an ndarray](https://github.com/scijs/ndarray), which may or may not be faster for reading and writing to a `BurnMatrix`

### Bypass `resample` function on initial return

Currently, `TimeSteps` are calculated and added to the `Campaign.timesteps` array. They are not resampled until the `Campaign` is ready to be sent to the front end. The `resample` function can be expensive on the CPU. However, for initial calculations, it can be avoided altogether. Within the iteration of `Timesteps`, `Timestep.snapshot`s can be added to a `Campaign.snapshots` array based on whether or not they satisfy the same constraints used when using `resample`, i.e., only adding a `snapshot` if `timestep.time <= latestSampleTime` just after adding the `Timestep` to `Campaign.timesteps`. The `Campaign` will always need to keep track of all `Timestep`s, as if a user wants to view the `Campaign` with a different timescale. For example, if a user initially wants to view a `Campaign` with a timescale of 1 hour, we can push `Timestep.snapshot`s to the `Campaign.snapshots` array every hour upon initial calculation. If they then want to view the same `Campaign` with a timescale of 1 day, we can then use the `resample` function against `Campaign.timesteps` to return that sampling.
