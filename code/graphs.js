const mapColours = ['#ffffff', '#d73027','#f46d43','#fdae61','#fee08b','#ffffbf','#d9ef8b','#a6d96a','#66bd63','#1a9850']
const legend = {
  VK:  ["large regression", "regression", "possible regression", "no development", "possible progression", "progression", "large progression"],
  K: ["Very insufficient", "largely insufficient", "insufficient", "somewhat lacking", "sufficient", "more than sufficient", "good", "very good", "excellent"]
}

window.onload = function() {
  // data loading promises
  const requests = [d3.json('data/gemeente.json'), d3.json('data/wijk.json')];

  Promise.all(requests).then(function(response) {
    console.log(response);

    // select all paths in the map
    let selection = d3.select(document.getElementById("municipalities").contentDocument)
                      .selectAll("path");
    let selection2 = d3.select(document.getElementById("districts").contentDocument)
                      .selectAll("path");

    // default settings of the map
    let centered = null,
        dataset = response[0],
        currentStat = 'KL16';

    // filter data so only data of a specific municipality remains
    function filterObject(data, code) {
      let z = Object.keys(data).filter(function(k) {
        return k.indexOf('WK' + code) == 0;
      }).reduce(function(newData, k) {
        newData[k] = data[k];
        return newData;
      }, {});
      return z;
    };

    // give all districts in a selected municipality a blue border
    function strokeDists(data, code) {
      // turn border of unselected districts back to grey
      d3.select(document.getElementById("districts").contentDocument)
          .selectAll(".selected")
          .attr("class", "")
          .style("opacity", 0.3);

      // turn border of selected districts to blue
      Object.keys(data).filter(function(k) {
        return k.indexOf('WK' + code) == 0;
      }).forEach(function(element) {
        let y = d3.select(document.getElementById("districts").contentDocument)
            .select("#" + element)
            .attr("class", "selected")
            .style("opacity", 1);
      });
    };

    // iterate over all paths in municipality map
    selection.each(function() {
      // set class for easier manipulation
      d3.select(this).attr("class", this.getAttribute('cbs'));

      // create onclick, which updates the map, line- and pie chart
      d3.select(this).on("click", function() {

        // zoom in to and change to district map
        mapZoom(this);

        // filter data
        let areaCode = this.getAttribute('cbs').slice(2);
        strokeDists(response[1], areaCode);
        dataset = filterObject(response[1], areaCode);

        // update pie chart
        updatePieGraph(dataset, currentStat);

        // create/update line chart
        let lineChart = d3.select(".lineChart");
        if (lineChart.empty()) {
          createLineGraph(response[0][this.getAttribute('cbs')]);
        } else {
          updateLineGraph(response[0][this.getAttribute('cbs')]);
          document.getElementById("lineChart").style.visibility = "visible";
        };

        // make some stuff appear
        document.getElementById("areaName").innerHTML = "Quality of life in " + this.getAttribute("gem");
        document.getElementById("back").innerHTML = "<button type='button' class='backButton'>Back</button>";
      });
    });

    // css failed due to embedding, now using d3 for strokes
    selection2.attr("stroke", "#6e6e6e")
        .style("opacity", 0.3);

    // make the name of a district appear if it is hovered over
    selection2.each(function() {
      let name = this.id.slice(16);
      if (name.slice(0, 4) == "Wijk") {
        name = name.slice(8);
      };
      d3.select(this).attr("name", name);
      d3.select(this).append("title").text(name);
    });

    // create onclick for every district to update line- and pie chart
    selection2.each(function() {

      // change id for easier manipulation
      this.id = this.id.slice(7, 15);

      // create onclick, which updates the map, line- and pie chart
      d3.select(this).on("click", function() {

        // pan to other district
        mapZoom(this);

        // filter data
        let areaCode = this.getAttribute('id');
        strokeDists(response[1], areaCode.slice(2, 6));
        dataset = filterObject(response[1], areaCode.slice(2, 6));

        // update pie chart
        updatePieGraph(dataset, currentStat);

        // update line chart
        updateLineGraph(response[1][areaCode]);
        document.getElementById("lineChart").style.visibility = "visible";

        // make some stuff appear
        let muniName = d3.select(document.getElementById("municipalities").contentDocument)
          .select(".GM" + this.getAttribute("id").slice(2, 6))
          .attr("gem");
        document.getElementById("areaName").innerHTML = "Quality of life in " + muniName;
        document.getElementById("back").innerHTML = "<button type='button' class='backButton'>Back</button>";
      });
    });

    // update map and piechart with a new stat
    function dataChange(stat) {
      updatePieGraph(dataset, stat);

      // update municipality map
      selection.each(function() {
        let score = response[0][this.getAttribute('cbs')][stat];
        d3.select(this).attr("fill", mapColours[score]);
      });

      // update district map
      selection2.each(function() {
        let areaCode = this.getAttribute('id');
        let score = response[1][areaCode][stat] || 0;
        d3.select(this).attr("fill", mapColours[score]);
      });

      currentStat = stat;
    };

    // needed references for the following button
    let currentMode = 'KL16',
      options1 = ["2002-2016", "2002-2008", "2008-2012", "2012-2014", "2014-2016"],
      options2 = ["2016", "2014", "2012", "2008", "2002"];

    // button, which changes the map between current scores and development
    d3.select('#changeMode').on("click", function() {
      if (currentMode === 'KL16') {
        dataChange('VKL0216');
        modeChange(options1, 5);
        currentMode = 'VKL0216';
      } else {
        dataChange('KL16');
        modeChange(options2, 0);
        currentMode = 'KL16';
      };
    });

    // dropdown for selecting a year
    d3.select('#year').on("change", function() {
      let dropDown = document.getElementById("year");
      let selectedYear  = dropDown.options[dropDown.selectedIndex].value;
      let dictionary = ['KL16','KL14', 'KL12', 'KL08', 'KL02', 'VKL0216', 'VKL0208', 'VKL0812', 'VKL1214', 'VKL1416'];
      dataChange(dictionary[selectedYear]);
    });

    // button to go to municipality map and hide linechart and the button itself
    d3.select('.backButton').on("click", function() {

      // go to municipality map
      mapZoom(null);

      // update pie chart
      dataset = response[0];
      updatePieGraph(dataset, currentStat);

      // make some stuff disappear
      document.getElementById("areaName").innerHTML = "Quality of life in the whole country";
      document.getElementById("back").innerHTML = "";
      document.getElementById("lineChart").style.visibility = "hidden";
    })

    // create piechart
    createPieGraph(response[1]);

    // initial colours of the map
    dataChange('KL16');
  });
}

function createPieGraph(data) {
  // width, height and radius
  let w = 400,
    h = 400,
    r = 200;

  // initialize svg
  const svg = d3.select(".graphs")
      .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "pieChart");

  // start in the middle of the svg
  const g = svg.append("g")
      .attr("class", "slices")
      .attr("transform", `translate(${w / 2},${h / 2})`);
  svg.append("g")
      .attr("class", "labels")
      .attr("transform", `translate(${w / 2},${h / 2})`);

  // count data entries with the same score
  let counter = {};
  for (let key in data) {
    counter[data[key]['KL16']] = counter[data[key]['KL16']] + 1 || 0;
  };

  // remove entries without data
  delete counter["null"];

  // parse counted value into d3-compatible format
  let dataArray = [];
  for (let number in counter) {
    let object = {};
    object["number"] = number;
    object["value"] = counter[number];
    dataArray.push(object);
  };

  // let d3 figure out how the pie chart should be drawn
  let arcs = d3.pie().value(function(d) { return d.value; })
    .sort(function(a, b) { return a.number.localeCompare(b.number); })(dataArray);

  // define the radii of the pie chart
  let arc = d3.arc()
      .innerRadius(0)
      .outerRadius(r);

  // create pie chart
  g.selectAll("path")
      .data(arcs)
      .enter().append("path")
        .attr("fill", function(d) {
          return mapColours[d.data.number];
        })
        .attr("class", "arc")
        .attr("stroke", "white")
        .attr("d", arc);

  // selection of labels
  let text = d3.select(".pieChart").select(".labels").selectAll("text")
      .data(arcs);

  // add labeltext
  text.enter()
		  .append("text")
		  .text(function(d) {
  			return legend['VK'][d.data.number - 1];
  		});
}

function updatePieGraph(data, stat) {
  // count data entries with the same score
  let counter = {};
  for (let key in data) {
    counter[data[key][stat]] = counter[data[key][stat]] + 1 || 1;
  };

  // remove entries without data
  delete counter["null"];

  // parse counted value into d3-compatible format
  let dataArray = [];
  for (let number in counter) {
    let object = {};
    object["number"] = number;
    object["value"] = counter[number];
    dataArray.push(object);
  };

  // define the radii of the pie chart
  let arc = d3.arc()
      .innerRadius(0)
      .outerRadius(200);

  // define radius of labels
  let outerArc = d3.arc()
    	.innerRadius(125)
    	.outerRadius(125);

  // let d3 figure out how the pie chart should be drawn
  let arcs = d3.pie().value(function(d) { return d.value; })
    .sort(function(a, b) { return a.number.localeCompare(b.number); })(dataArray);

  // selection of slices
  let path = d3.select(".pieChart").select(".slices").selectAll("path").data(arcs);

  // add new slices if necessary
  path.enter().append("path")
          .transition()
          .duration(750)
          .attrTween("d", function(a) {
            var i = d3.interpolate({startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0}, a);
            this._current = i(0);
            return function (t) {
              return arc(i(t));
            };
          })
          .attr("fill", function(d) {
            return mapColours[d.data.number];
          });

  // remove obsolete slices
  path.exit().transition()
      .duration(750)
      .attrTween("d", function(a) {
        var i = d3.interpolate(this._current, {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0});
        this._current = i(0);
        return function (t) {
          return arc(i(t));
        };
      })
      .remove();

  // update slices
  path.transition()
      .duration(750)
      .attrTween("d", function(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
      })
      .attr("fill", function(d) {
        return mapColours[d.data.number];
      });

  // selection of labels
  let text = d3.select(".pieChart").select(".labels").selectAll("text")
		  .data(arcs);

  // the current map/piechart mode
  let mode = stat.split("L")[0];

  // add and edit labels
  text.enter()
		  .append("text")
		  .text(function(d) {
  			return legend[mode][d.data.number - 1];
  		}).merge(text).transition().duration(750)
      		.attrTween("transform", function(a) {
      			this._current = this._current || {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0};
      			var i = d3.interpolate(this._current, a);
      			this._current = i(0);
      			return function(t) {
      				var a2 = i(t);
      				var pos = outerArc.centroid(a2);
      				return "translate("+ pos +") " +
                      "rotate("+ getAngle(a) +")";
      			};
      		})
      		.style("text-anchor", "middle")
          .text(function(d) {
            if ((d.endAngle - d.startAngle) > 0.12) {
              return legend[mode][d.data.number - 1];
            };
          });

  // find correct rotation angle for labels
  function getAngle(d) {
    let angle = (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
    if (angle > 91) {
      angle = angle - 180;
    };
    return angle;
  };

  // remove obsolete labels
  text.exit().remove();
}

function createLineGraph(data) {
  // width, height and the margin for text
  let w = 600,
    h = 300,
    margin = 25;

  // prune and reparse data into d3-compatible format
  let dataArray = [];
  for (let key in data) {
    let object = {},
      splitKey = key.split("L");
    if (key[0] === "K") {
      object["value"] = data[key];
      object["year"] = parseInt(splitKey[1]) + 2000;
      dataArray.push(object);
    };
  };

  // x scale
  let xScale = d3.scaleLinear()
      .domain([2002, 2016])
      .range([margin, w - margin]);

  // y scale
  let yScale = d3.scaleLinear()
      .domain([0, 10])
      .range([h - margin, margin]);

  // function that will create the path of the line
  let line = d3.line()
      .defined(function(d) { return d.value; })
      .x(function(d) { return xScale(d.year); })
      .y(function(d) { return yScale(d.value); });

  // initialize svg
  let svg = d3.select(".graphs").append("svg")
      .attr("width", w + 2 * margin)
      .attr("height", h + 2 * margin)
      .attr("class", "lineChart")
      .attr("id", "lineChart");

  // x axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (h - margin) + ")")
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")).tickSize(-h + 2 * margin));

  // x axis label
  svg.append("text")
      .attr("class", "x label")
      .attr("transform", "translate(" + (w/2 - margin) + ", " + h + ")")
      .text("Years");

  // y axis
  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin + ", 0)")
      .call(d3.axisLeft(yScale).tickSize(-w + 2 * margin));

  // y axis label
  svg.append("text")
      .attr("class", "x label")
      .attr("x", -h/1.4)
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text("Quality of Life score");

  // the actual line
  svg.append("path")
      .datum(dataArray)
      .attr("class", "line")
      .attr("d", line);
}

function updateLineGraph(data) {
  // width, height and the margin for text
  let w = 600,
    h = 300,
    margin = 25;

  // prune and reparse data into d3-compatible format
  let dataArray = [];
  for (let key in data) {
    let object = {},
      splitKey = key.split("L");
    if (key[0] === "K") {
      object["value"] = data[key];
      object["year"] = parseInt(splitKey[1]) + 2000;
      dataArray.push(object);
    };
  };

  // x scale
  let xScale = d3.scaleLinear()
      .domain([2002, 2016])
      .range([margin, w - margin]);

  // y scale
  let yScale = d3.scaleLinear()
      .domain([0, 10])
      .range([h - margin, margin]);

  // function that will create the path of the line
  let line = d3.line()
      .defined(function(d) { return d.value !== null; })
      .x(function(d) { return xScale(d.year); })
      .y(function(d) { return yScale(d.value); });

  // editing the line
  d3.select("#lineChart")
      .select(".line")
        .datum(dataArray)
        .transition()
        .attr("d", line);
}

function modeChange(options, addition) {
  // remove all options from dropdown
  let dropdown = document.getElementById("year");
  let length = dropdown.options.length;
  for (i = 0; i < length; i++) {
    dropdown.remove(0);
  };

  // place new options of dropdown
  length = options.length;
  for (i = 0; i < length; i++) {
    let option = document.createElement("option");
    option.text = options[i];
    option.value = i + addition;
    dropdown.add(option);
  };
}

function mapZoom(clicked) {
  // x, y coordinates, zoom amount k, id, width and height
  let x, y, k, id,
    w = 700,
    h = 820;

  if (clicked) {
    // zoom in
    id = clicked.getAttribute('cbs') || clicked.id;
    let bBox = clicked.getBBox();

    if (clicked.id) {
      // within district map
      x = bBox.x + bBox.width/2;
      y = bBox.y + bBox.height/2;
    } else {
      // from municipality map to district map
      x = (bBox.x + bBox.width/2 - 65) * 820 / 510
      y = (bBox.y + bBox.height/2 - 30) * 955 / 605
    }
    k = 6;

    // municipality map becomes invisible, district map visible
    d3.select("#municipalities").attr("class", "invisible");
    d3.select("#districts").attr("class", "map");
  } else {
    // zoom out
    x = w / 2;
    y = h / 2;
    k = 1;

    // municipality map becomes visible, district map invisible
    d3.select("#municipalities").attr("class", "map");
    d3.select("#districts").attr("class", "invisible");
  };

  // selection of district map
  selection = d3.select(document.getElementById("districts").contentDocument)
      .select("g");

  // do the zooming
  selection.transition()
      .duration(1000)
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}
