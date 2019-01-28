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
Tried converting the geojson to topojson, but there is no difference. After multiple attempts at creating the map, I came to the conclusion that it would not work.  
Now I will download a .svg from wikipedia, embed it in my html as <object> and alter it if possible for my own purposes.

# Day 6
I changed the way 'leefbaarheid'-scores are formatted in the json from [{}] to {place1: {}, etc}. The former format was obtained when the .xlsx was converted to .json by an online converter, but the latter format is more useful due to being able to select a municipality by their name/code.  

# Day 7
Styleguide

# Day 8
I want to make it that if you hover over the piechart, all paths with the same colour light up. But I have not implemented that yet.

# Day 9
At first I wanted to make a map of municipalities, which when clicked would change to a map of the municipality that was clicked. However, I can't actually create the maps.  
So now I will use a map of all districts and a map of all municipalities. the district map will initially be invisible and only the municipality map can be interacted with.  
Once a municipality is clicked, the map will zoom in on the municipality, the municipality map will become invisible and the district map visible. At that point only the district map will be interactable. I put the map in the html and made it invisible, but I have not yet implemented the rest.

# Day 10
Decided to put a transition in the line and pie chart.

# Day 11
Css failed to work on the embedded map. Now using d3 to add borders between areas.  
Currently using the district map instead of the municipality map.
Added labels to pie chart, but not all of them. I had to prevent overlap somehow... right?

# Day 12
Readded municipality map and it switches to district map if it is clicked. This is what i originally intended, but had delayed implementing.  
Now I still have to make the pie chart switch to "municipality mode" instead of always showing the distribution in the country.  
known bugs: pie chart text sometimes shows up in the middle of the chart, back button does not disappear when you go back by clicking the same district twice.

# Day 13
Pie chart switches between modes successfully (disregarding the textbug).  
I disabled zooming out when a district is clicked twice. That solves one of the bugs.  
Added function that turns strokes of all districts in the selected municipality blue.  
additional bug: the border of a district does not always appear blue if it borders a district in an unselected municipality

# Day 14
Fixed pie chart text bug with a simple .merge()  
Added district names to the map

# Day 15
Added some more comments
