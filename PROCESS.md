# Day 1
Decided to update proposal with a third unique graph. Instead of 4 linked interactive graphs of 2 types I will now have 3 different linked interactive graphs.  

# Day 2
Found out geojsons are easier to use than shapefiles and found a script that converts shapefiles to geojson.  
Made a dropdown for time and a button to switch it between years and time periods

# Day 3
Temporarily using a picture of the Netherlands as placeholder to click on.
I will probably have the map on the left of the screen, pie chart upper-right and line chart lower-right. with the buttons above the map.  
A json file would be easier to use than a xlsx file. Conversions were made.

# Day 4
The script I found for converting shapefiles to geojson in javascript could not be used. The script works fine with one shapefile, but loading two shapefiles at the same time causes one of the resulting geojsons to be overwritten somehow. There is actually no reason for me to preprocess when my script is run, so I have converted them using PyShp and saved them as json files.
The preprocessed geojsons are too large for github, so I zipped them and found a way to unzip them in my script.

# Day 5
Made an attempt at creating a map. I got a square that makes my site unresponsive.  
I am thinking of converting the geojson to a topojson as many examples use this format. If I were to use topojson, I would not have to zip and unzip the geojson.  
Tried the conversion, but there is no difference. After multiple attempts at creating the map, I came to the conclusion that it would not work.  
Now I will download a .svg from wikipedia and add it to my html and alter it if possible for my own purposes.
