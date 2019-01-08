# minorproject
Koen Dielhoff

## Problem statement
Which part of the Netherlands is best to live in if money is of no concern?

## solution
The "leefbaarometer" has data about how well people are living in certain areas of the Netherlands. This data just has to be visualised.

![missing picture](https://github.com/koenkoen1/minorproject/blob/master/doc/plaatje.png)

### features (minimum viable product)
leefbaarheidmap of municipalities in the country that transforms into a map of the districts in the chosen municipality.
linegraph  of leefbaarheid in a chosen municipality/district over a period of time.
piechart with distribution of leefbaarheid in the country/chosen municipality.
dropdownbox for time periods
dropdownbox to choose between current leefbaarheid and change in leefbaarheid.
Button to return to the map of municipalities in the country.

## prerequisites
### data source
https://data.overheid.nl/data/dataset/leefbaarometer-2-0---meting-2016  
The leefbaarometer score is dependent on 100 factors divided into categories:
1. houses (quantity, amount of detached houses, etc)
2. residents (amount of immigrants, elders or single-parents, etc)
3. services (distance to services, schools and doctors within 1 km, disappearing grocery stores, etc)
4. safety (nuisances, disturbances, violence, burglaries)
5. environment (quantity of monumnets, surface covered with green or water, risks of natural disasters, etc)  

### external components
for converting shapefile to geojson:  
https://github.com/gipong/shp2geojson.js

### similar visualisations
none yet

### hardest parts
Interpreting the shapefile included in the data and visualising the map
