# Firestarter.io - Algorithm Documentation

## About

These documents give a high-level description of the core fire-prediction algorithm that lies at the heart of FireStarter. These docs do not provide exhaustive api-style documentation for every property and method available throughout the FireStarter codebase.

## Philosophy

FireStarer.io's central algorithm takes a [cellular automata](https://en.wikipedia.org/wiki/Cellular_automaton) approach to modeling wildfire phenomena. A geographic location under examination is abstracted into a grid, and environmental factors at each point in the grid can be extracted from GIS raster data (DEM, groundcover, etc.). Calculations are made based off of the data at each point to determine whether or not fire will spread into that point, what affect that may have on human development, and vice versa.

Because the computational burden of such an algorithm is high, it is best to run the algorithm on machines that are optimized for running large numbers of calculations in as fast a time as possible. For that reason, the algorithm is couched in a server-side application, which can be run using compute-optimized cloud resources, offloading the computational burden to faster machines.
