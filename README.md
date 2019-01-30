# Quality of Life in the Netherlands
Koen Dielhoff

## Introduction
The [leefbaarometer](https://data.overheid.nl/data/dataset/leefbaarometer-2-0---meting-2016) has data about how well people are living, i.e the quality of life (QoL), in certain areas of the Netherlands. The score ranges from 1, very insufficient, to 9, excellent. The development of the QoL has also been given a score, which ranges from 1, large regression, to 7, large progression.  
With this data I made this map so people can easily search and find how good the quality of life is in their and any of their acquaintances' neighbourhoods.

![missing picture](https://github.com/koenkoen1/minorproject/blob/master/doc/entry.png)

### features
QoL map of municipalities in the country.  
Piechart with distribution of the QoL in the country/chosen municipality.  
Piechart also functions as a legend for the maps.  
Dropdown for selecting a time or period.  

![missing picture](https://github.com/koenkoen1/minorproject/blob/master/doc/development.png)  
Button to choose between current QoL or development in it.  

![missing picture](https://github.com/koenkoen1/minorproject/blob/master/doc/zoomed.png)  
Municipality map transforms into a map of the districts and zooms in on a chosen municipality.  
Linegraph  of the QoL in a chosen municipality/district over a period of time.  
Button to make the district map transform back into the municipality map.  

### external components
[leefbaarometer data](https://data.overheid.nl/data/dataset/leefbaarometer-2-0---meting-2016), the shapefile of the districts was converted to an svg on mapshaper.org.  
[d3](https://github.com/d3/d3). The d3 license is included in the d3 folder, so I am allowed to use it.  
[municipality map](https://upload.wikimedia.org/wikipedia/commons/b/b7/Nederland_gemeenten_2016.svg)  
the smooth pie chart transitions were copied from [here](http://bl.ocks.org/dbuezas/9306799). no license

### copyright statement
This is free and unencumbered software released into the public domain.
