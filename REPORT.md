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
This function is called when the map and pie chart have to switch between times or periods. Calls updatePieGraph() and sets the colours of every municipality/district on the map. The selected time/period is saved as variable in case updatePieGraph is called outside this function.

##### mode button onclick
calls dataChange() with the new time/period

......
