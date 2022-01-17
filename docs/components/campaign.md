# `Campaign`

## Creation

A `Campaign` represents a complete simulation in Firestarter. Given a set of user inputs, a `new Campaign` is created and its timeline begins running. A Campaign contains the following main properties

- `Campaign.extents` - Array of [`Extent`](/components/extent/extent/) objects
- `Campaign.eventQueue` - The [event queue](/components/queue/queue/) of the campaign
- `Campaign.timesteps` - Array of `Timestep` objects

A `Campaign` object acts as the coordinator and center of all activities required to run a simulation
