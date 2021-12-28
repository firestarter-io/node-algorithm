# Data Types

Firestarter requires a myriad of GIS data, readily available via web sources for the areas where simulations are being run. The subject content of data can generally be divided into two classes: environmental data, and human-oriented data. Here are a few examples of each:

**Environmental Data Types**

- Topography (elevation, slope, aspect)
- Ground Cover
- Weather (wind, temperature, humidity)

**Human Oriented Data**

- Real estate data
- Fire supression capabiity
- Census bureau data

How data is retrieved depends on the type of data and available sources. Data must be available for any given point on the map in a given map extent. For a given point, different data types will be available in different formats, generally falling into one of the two following types:

- **Scalar**: A singular numerical value. For example, elevation is numerical value in meters

- **Vector**: A value with magnitude and direction. For example, wind has both speed and direction, or topography has both slope (magnitued) and aspet (direction)
