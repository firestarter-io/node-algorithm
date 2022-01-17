The `PriorityQueue` class is a TypeScript implementation of the [priority queue data structure](https://en.wikipedia.org/wiki/Priority_queue). Every campaign will have an `eventQueue` property, which is an instance of a `PriorityQueue`.

## Events

The event queue is composed of `EventQueueItem`s. Each `EventQueueItem` provides information about some future event. An `EventQueueItem` takes this shape:

```typescript
interface EventQueueItem {
	time: number;
	setToBurning?: {
		[key: string]: Cell;
	};
	setToBurnedOut?: {
		[key: string]: Cell;
	};
}
```

Detailed information on `EventQueueItem` properties can be found in the codebase comments.

## Event creation

The events in the event queue have an asymetrical, one-to-one relationship with `TimeStep`s. When a `Campaign` initializes, an initlal event is pushed into the queue with the first cell to be set to burning, and then a first `TimeStep` is initialized. Within the constructor of a `TimeStep`, it looks for the next event in the queue, and if it finds one, it performs its function based on the next queue event.

For every event in the queue, a `TimeStep` will be created. In turn, a `TimeStep` may spawn more events to be added to the queue. A `TimeStep` may spawn multiple events to be added, or none at all.

<figure style="padding: 10px; margin: 0;">
    <img src="../queue-timestep.png" style="width: 400px; margin: auto;"">
    <figcaption>
      An event in the queue, noted by <em>e</em> above, fuels the creation of a <code>TimeStep</code>, which in turn spawns more events to be added to the queue.
    </figcaption>
</figure>

## TimeStep → Queue → TimeStep

When a `TimeStep` retrieves the next item out of the queue, that item is removed from the queue (though for development environments, it is moved to `PriorityQueue.history` for debugging purposes). A `TimeStep` always ends with a new one being created. The next `TimeStep` is always processing the next event in the queue, if there is one. And because a `TimeStep` may spawn new queue events (especially in the first portion of a simulation), the simulation runs in a continuous fashion. When there are no more events in the queue, the simulation ends.

<figure style="padding: 10px; margin: 0;">
    <img src="../queue-timestep-more.png" style="margin: auto;"">
    <figcaption style="margin-top: 20px;">
      TimeSteps spawn more events, which provide the information required in the next Timestep, and so on.
    </figcaption>
</figure>

## Separation of Concerns

`TimeStep`s and queue events are kept as separate entities to maintain **_separation of concerns_**. Each has its own concerns:

### `TimeStep`

- Record the _current state_ of the simulation and affect changes in the `Campaign`'s various components (`Extents`, `BurnMatrices`, `Cells`, etc.)
- Perform calculations to _make decisions_ about what should happen in the future, and pushes those decisions in the queue
- Create snapshots of the `Campaign's` state at a given time that can be serialized, sent, and used in a client application

### `EventQueueItem`

- Store information about what should happen _in the future_

For example, an item $I$ sitting in the queue determines that at time $t_x$, Cells $A$, $B$, and $C$ should ignite, while Cells $D$, $E$, and $F$ should burn out, and Cells $G$ and $H$ should be supressed. However it is not until a `TimeStep` $T$ is generated and retrieves $I$ from the queue, that the program iterates over the specified Cells, and changes their state within their respective `BurnMatrix`. While iterating over a `Cell`, $T$ will determine what should happen to that `Cell`'s neighbors, and generate new items to add to the queue, if any.
