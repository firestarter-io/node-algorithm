### firestarter.io

## Branch `probability-based`

This branch contains an older version of the algorithm which is based on probability. It uses the [Wildfire Risk Probability](https://apps.fs.usda.gov/arcx/rest/services/RDW_Wildfire/ProbabilisticWildfireRisk/MapServer) dataset from USFS to determine the _likelihood_ that a cell will burn. However, this model was abandoned due to the issue described in the question [Stochastic cellular automata - algorithm limited by 1 cell per timestep](https://scicomp.stackexchange.com/questions/38990/stochastic-cellular-automata-algorithm-limited-by-1-cell-per-timestep/). This was abandoned in favor of a priority-queue based model, which uses the USFS fuel models and a deterministic Rate of Spread based model. [The docs on the PriorityQueue component](https://firestarter-io.github.io/node-algorithm/algorithm/queue/queue/) explain this well.

Branching this for archive and reference purposes.

# node-algorithm

node-algorithm is a nodejs application written in typescript. It contains an api for communication with the firstarter ui, and the burn-code algorithm.

https://firestarter-io.github.io/node-algorithm/

## folder structure

- controllers: route controller functions
- core: central algorithm code
- types: collection of typescript types
