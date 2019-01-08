Data was obtained from https://data.overheid.nl/data/dataset/leefbaarometer-2-0---meting-2016 and is saved locally.  
The data is obtained in the form of "leefbaarheid" scores per municipality/district and shapefiles for these areas.  
I found a script at https://github.com/gipong/shp2geojson.js, which I will use to convert shapefiles to usable geojsons.

![missing picture](https://github.com/koenkoen1/minorproject/blob/master/doc/designDiagram.png)

For making and updating the graphs D3 will be used and the D3-tips plugin will be used to add and update tooltips.  
shp2geojson is the script i found for converting shapefiles and could potentially be removed once I have converted them.  
The parse function will couple the mapshapes to the leefbaarheid scores and remove unnecessary parts from the data.  
The data will be passed on to the function that needs it. The maptooltip and buttons can influence which part of the coupled data is passed on.
