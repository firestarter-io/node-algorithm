# Slope's Effect on Rate of Spread

All competent simulations of fire spread must consider the effect of local topography on a fire's local rate of spread ($RoS$). 

## Rothermel

The most classic consideration comes from [Rothermel, 1972](https://www.fs.usda.gov/treesearch/pubs/32533), eq 46:

$$ \phi_S = \frac{R_S}{R_0} - 1 $$

Where $R_S$ is rate of spread with slope accounted for, and $R_0$ is rate of spread of a given fuel type on a flat plane. Reorganizing for $R_S$:

$$ R_S = R_0 * \phi_S + 1 $$

This equation becomes useful, as $R_0$ is empirically available for Andersen's 13 fuel types. The equation for $\phi_S$ is given by Rothermel equation 51:

$$ \phi_S = 5.275 * \beta^{-0.3} * tan(\theta)^{2} $$

where $tan(\theta)$ is the slope of the fuel bed.  $tan(\theta)$ can also be computed simply as the rise over run between points $a$ and $b$.  This is especially convenient, as computing $x/y$ is orders of magnitude more computationally efficient than using the $tan$ function.
