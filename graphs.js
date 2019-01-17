const mapColours = ['#ffffcc','#d9f0a3','#addd8e','#78c679','#31a354','#006837']

window.onload = function() {
  // data loading promises
  const requests = [d3.json('data/gemeente.json'), d3.json('data/wijk.json')];

  Promise.all(requests).then(function(response) {
    console.log(response);

    // select all paths in the map
    let selection = d3.select(document.getElementById("map").contentDocument)
                      .selectAll("path");

    // iterate over all paths in map
    selection.each(function() {
      // create onclick, which updates the line- and piechart
      d3.select(this).on("click", function() {
        let lineChart = d3.select(".lineChart")
        if (lineChart.empty()) {
          createLineGraph(response[0][this.getAttribute('cbs')]);
        };
        document.getElementById("back").innerHTML = "<button type='button' onclick='toCountry()'>Back</button>";
      });
    });

    // changes the colours of each path in the map
    function dataChange(stat) {
      selection.each(function() {
        let score = response[0][this.getAttribute('cbs')][stat]
        d3.select(this).attr("fill", mapColours[score - 4])
      })
    }

    // initial colours of the map
    dataChange('KL16')

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

    d3.select('#year').on("change", function() {
      let dropDown = document.getElementById("year");
      let selectedYear  = dropDown.options[dropDown.selectedIndex].value;
      let dictionary = ['KL16','KL14', 'KL12', 'KL08', 'KL02', 'VKL0216', 'VKL0208', 'VKL0812', 'VKL1214', 'VKL1416']
      dataChange(dictionary[selectedYear]);
    });

    // create piechart
    createPieGraph(response[0])
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
        .attr("class", "pieChart")

  // start in the middle of the svg
  const g = svg.append("g")
      .attr("transform", `translate(${w / 2},${h / 2})`);

  // count data entries with the same score
  let counter = {}
  for (let key in data) {
    counter[data[key]['KL16']] = counter[data[key]['KL16']] + 1 || 0;
  };

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
          return mapColours[d.data.number - 4];
        })
        .attr("stroke", "white")
        .attr("d", arc)
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
      .x(function(d) { return xScale(d.year); })
      .y(function(d) { return yScale(d.value); })

  // initialize svg
  let svg = d3.select(".graphs").append("svg")
      .attr("width", w + 2 * margin)
      .attr("height", h + 2 * margin)
      .attr("class", "lineChart")

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
