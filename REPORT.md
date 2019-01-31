# Report

![missing picture](https://github.com/koenkoen1/minorproject/blob/master/doc/zoomed.png)

My application allows someone to see how good the Quality of Life is in every municipality/district of the Netherlands.


## Technical design
Once the window is done loading, d3 parses the QoL data. The next part in the window.onload belongs to creating the maps and their onclick. Then comes the functionality of the buttons and dropdown.  
The functions for creating and updating the pie and line chart are defined outside of the onload along with a function for changing the dropdown options and zooming in the map.  

### Making the maps interactable

##### filterObject()
When the map is clicked this function will filter the data so only data from a specific part of the map remains.

##### opaqueDists()
When the map is clicked this function will make sure only the area belonging to the clicked municipality remains completely opaque

##### selection.each()
An onclick is created for each municipality/district, which zooms in on the map with mapZoom(), then uses opaqueDists() and filterObject(). With the filtered data updatePieGraph() will update the pie chart. The line chart gets updated with updateLineGraph() or created with createLineGraph(). Lastly the onclick makes the back button and line chart visible.

##### misc.
The districts are given grey borders. The names of the districts are removed from their id and saved as a name attribute. A title is added to every district which contains their name.

### Button functionality

##### dataChange()
This function is called when the map and pie chart have to switch between times or periods. Calls updatePieGraph() and sets the colours of every municipality/district on the map. The selected time/period is saved as variable in the window.onload for when updatePieGraph is called outside this function.

##### mode button onclick
calls dataChange() with the new time/period, calls modeChange() to update the options in the dropdown and changes the text of the button itself.

##### dropdown onchange
call dataChange() with the selected time/period.

##### back button onclick
zoom out the map with and return to the municipality map with mapZoom(). Call updatePieGraph with the municipality stats. Hides itself and the line chart.

### Initial state
createPieGraph() is called to simply create the pie chart. The data it is given does not matter as afterwards dataChange() is called to set the initial state of the map and pie chart.

### Pie chart
createPieGraph() and updatePieGraph() add up all entries with the same score and format them in a way that is easy to use with d3. The pie chart and labels are created or updated with d3. Special transitions were used that work well with pie charts

### line chart
createLineGraph() and updateLineGraph() filter away the development scores and format the data in a way that is easy to use with d3. The line chart is then created or updated with d3.

### mapZoom()
Finds the coordinates of the clicked municipality/district, centers it and zooms in. An arbitrary multiplier is used when switching from municipality map to district map. This function zooms out if no path was provided

## Difficulties
### Getting the maps working
The data came with shapefiles for the maps which the data should be coupled to. I used ogre.adc4gis.com to convert them to geojsons. When I used d3 to create the maps, however, I got a black box instead of a map. Closer inspection revealed that it consisted of many random lines. I tried using mapshaper.org as alternative and simplified them, but nothing changed. I then tried using topojson instead of geojson, but that still did not work.  
Eventually I embedded an svg of the municipalities from wikipedia and used that. The one problem was that there was no svg for the districts. Luckily, I then found out that mapshaper.org could also convert the shapefile to a svg. I converted and simplfied the district map with this site and kept using the municipality map from wikipedia.  
A downside of this solution was that css would not work on the maps, selecting a map with d3 had to be done in a roundabout way and the name and code of the district had to be put in their id when the map was converted. Originally I wanted to draw only the districts in the municipality, but being able to see and pan to other neighbouring districts ended up looking better than I expected. But there are still more advantages to drawing the map yourself than embedding one.

### pie chart transitions
At first I created my pie chart according to a block in bl.ocks.org with some changes and tweaks to make it work in my program. However, when I tried to add transitions, there were only transitions when the data was changed and none when slices were added or removed. After trying to find out how the code worked, I found out that the transition would always be made from their current location to the location where they were supposed to end up.  
To fix this I changed the function in the .attrTween() to make the start location the top of the pie chart when appending and make the end location also the top of the pie chart when removing. If I had more time I would have liked to make a single function instead of having a slightly differing code in every .attrTween()

Another problem was that labels would sometimes appear in the center of the pie chart instead of where they were supposed to appear. I had an enter().append() and a block of text the altered the labels, but after removing that block of text and adding a .merge() to the part with the enter(), the labels functioned as they were supposed to.

## Possible changes that could be implemented
defining the update functions within their respective create functions and making the create functions return the update functions.  
pie chart tooltip and making a proper tooltip for the map.
