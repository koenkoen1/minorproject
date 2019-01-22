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

    // iterate over all paths in map
    selection.each(function() {
      // create onclick, which updates the line- and piechart
      d3.select(this).on("click", function() {
        let lineChart = d3.select(".lineChart")
        if (lineChart.empty()) {
          createLineGraph(response[0][this.getAttribute('cbs')]);
        } else {
          updateLineGraph(response[0][this.getAttribute('cbs')]);
          document.getElementById("lineChart").style.visibility = "visible";
        }
        document.getElementById("back").innerHTML = "<button type='button' class='backButton'>Back</button>";
      });
    });

    // css failed, now using d3
    selection2.attr("stroke", "#6e6e6e");

    // map is not zoomed in
    let centered = null;

    // create onclick for every district to update line- and pie chart
    selection2.each(function() {
      d3.select(this).on("click", function() {
        centered = mapZoom(this, centered);
        let lineChart = d3.select(".lineChart")
        let areaCodes = this.getAttribute('id').split("|")
        if (lineChart.empty()) {
          createLineGraph(response[1][areaCodes[1]]);
        } else {
          updateLineGraph(response[1][areaCodes[1]]);
          document.getElementById("lineChart").style.visibility = "visible";
        }
        document.getElementById("back").innerHTML = "<button type='button' class='backButton'>Back</button>";
      })
    })

    // update map and piechart with the new stat
    function dataChange(stat) {
      updatePieGraph(response[1], stat);
      selection.each(function() {
        let score = response[0][this.getAttribute('cbs')][stat];
        d3.select(this).attr("fill", mapColours[score]);
      });
      selection2.each(function() {
        let areaCodes = this.getAttribute('id').split("|")
        let score = response[1][areaCodes[1]][stat] || 0
        d3.select(this).attr("fill", mapColours[score]);
      })
    }

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
      let dictionary = ['KL16','KL14', 'KL12', 'KL08', 'KL02', 'VKL0216', 'VKL0208', 'VKL0812', 'VKL1214', 'VKL1416']
      dataChange(dictionary[selectedYear]);
    });

    // button to (go to municipality map and) hide linechart and this button
    d3.select('.backButton').on("click", function() {
      centered = mapZoom(null, centered)
      document.getElementById("back").innerHTML = ""
      document.getElementById("lineChart").style.visibility = "hidden";
    })

    // create piechart
    createPieGraph(response[1])

    // initial colours of the map
    dataChange('KL16')
  });
}

function createPieGraph(data) {
  // width, height and radius
  let w = 600,
    h = 600,
    r = 150;

  // initialize svg
  const svg = d3.select(".graphs")
      .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "pieChart")

  // start in the middle of the svg
  const g = svg.append("g")
      .attr("class", "slices")
      .attr("transform", `translate(${w / 2},${h / 2})`);
  svg.append("g")
      .attr("class", "labels")
      .attr("transform", `translate(${w / 2},${h / 2})`);
  svg.append("g")
      .attr("class", "lines")
      .attr("transform", `translate(${w / 2},${h / 2})`);

  // count data entries with the same score
  let counter = {}
  for (let key in data) {
    counter[data[key]['KL16']] = counter[data[key]['KL16']] + 1 || 0;
  };

  Object.defineProperty(counter, "0",
      Object.getOwnPropertyDescriptor(counter, "null"));
  delete counter["null"];

  // parse counted value into d3-compatible format
  let dataArray = []
  for (let number in counter) {
    let object = {}
    object["number"] = number;
    object["value"] = counter[number];
    dataArray.push(object)
  }

  // let d3 figure out how the pie chart should be drawn
  let arcs = d3.pie().value(function(d) { return d.value; })
    .sort(function(a, b) { return a.number.localeCompare(b.number); })(dataArray);

  // define the radii of the pie chart
  let arc = d3.arc()
      .innerRadius(0)
      .outerRadius(r)

  // create pie chart
  g.selectAll("path")
      .data(arcs)
      .enter().append("path")
        .attr("fill", function(d) {
          return mapColours[d.data.number];
        })
        .attr("class", "arc")
        .attr("stroke", "white")
        .attr("d", arc)

  let text = d3.select(".pieChart").select(".labels").selectAll("text")
      .data(arcs)

  text.enter()
		  .append("text")
		  .text(function(d) {
  			return legend['VK'][d.data.number - 1];
  		});
}

function updatePieGraph(data, stat) {
  // count data entries with the same score
  let counter = {}
  for (let key in data) {
    counter[data[key][stat]] = counter[data[key][stat]] + 1 || 0;
  };

  Object.defineProperty(counter, "0",
      Object.getOwnPropertyDescriptor(counter, "null"));
  delete counter["null"];

  // parse counted value into d3-compatible format
  let dataArray = []
  for (let number in counter) {
    let object = {}
    object["number"] = number;
    object["value"] = counter[number];
    dataArray.push(object)
  }

  // define the radii of the pie chart
  let arc = d3.arc()
      .innerRadius(0)
      .outerRadius(150)

  let outerArc = d3.arc()
    	.innerRadius(215)
    	.outerRadius(215);

  // let d3 figure out how the pie chart should be drawn
  let arcs = d3.pie().value(function(d) { return d.value; })
    .sort(function(a, b) { return a.number.localeCompare(b.number); })(dataArray);

  // selection
  let path = d3.select(".pieChart").select(".slices").selectAll("path").data(arcs)

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
          })

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
      })

  let text = d3.select(".pieChart").select(".labels").selectAll("text")
		  .data(arcs)

  let mode = stat.split("L")[0]

  text.enter()
		  .append("text")
		  .text(function(d) {
  			return legend[mode][d.data.number - 1];
  		})


  function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

  function getAngle(d) {
    let angle = (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
        if (angle > 180) {
      angle = angle - 180;
    };
    return angle;
  };

  text.transition().duration(1000)
		.attrTween("transform", function(a) {
			this._current = this._current || a;
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
      if ((d.endAngle - d.startAngle) > 0.05) {
        return legend[mode][d.data.number - 1];
      }
    });

  text.exit()
		.remove();
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
      dataArray.push(object)
    }
  }

  // x scale
  let xScale = d3.scaleLinear()
      .domain([2002, 2016])
      .range([margin, w - margin])

  // y scale
  let yScale = d3.scaleLinear()
      .domain([0, 10])
      .range([h - margin, margin]);

  // function that will create the path of the line
  let line = d3.line()
      .defined(function(d) { return d.value; })
      .x(function(d) { return xScale(d.year); })
      .y(function(d) { return yScale(d.value); })

  // initialize svg
  let svg = d3.select(".graphs").append("svg")
      .attr("width", w + 2 * margin)
      .attr("height", h + 2 * margin)
      .attr("class", "lineChart")
      .attr("id", "lineChart")

  // x axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (h - margin) + ")")
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")).tickSize(-h + 2 * margin))

  // y axis
  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin + ", 0)")
      .call(d3.axisLeft(yScale).tickSize(-w + 2 * margin));

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
      dataArray.push(object)
    }
  }

  // x scale
  let xScale = d3.scaleLinear()
      .domain([2002, 2016])
      .range([margin, w - margin])

  // y scale
  let yScale = d3.scaleLinear()
      .domain([0, 10])
      .range([h - margin, margin]);

  // function that will create the path of the line
  let line = d3.line()
      .defined(function(d) { return d.value !== null; })
      .x(function(d) { return xScale(d.year); })
      .y(function(d) { return yScale(d.value); })

  d3.select("#lineChart")
      .select(".line")
        .datum(dataArray)
        .transition()
        .attr("d", line);
}

function modeChange(options, addition) {
  let dropdown = document.getElementById("year");
  let length = dropdown.options.length;
  for (i = 0; i < length; i++) {
    dropdown.remove(0);
  };

  length = options.length;
  for (i = 0; i < length; i++) {
    let option = document.createElement("option");
    option.text = options[i];
    option.value = i + addition;
    dropdown.add(option);
  };
}

function mapZoom(clicked, centered) {
  let x, y, k,
    w = 700,
    h = 820;

  if (clicked && centered !== clicked.id) {
    let bBox = clicked.getBBox();
    x = bBox.x + bBox.width/2;
    y = bBox.y + bBox.height/2;
    k = 6;
    centered = clicked.id;
  } else {
    x = w / 2;
    y = h / 2;
    k = 1;
    centered = null;
  }

  d3.select(document.getElementById("districts").contentDocument)
      .select("g")
        .transition()
          .duration(750)
          .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", 1.5 / k + "px");

  return centered
}
