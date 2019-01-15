const mapColours = ['#ffffcc','#d9f0a3','#addd8e','#78c679','#31a354','#006837']

window.onload = function() {
  // var shapesZip = new JSZip.external.Promise(function (resolve, reject) {
  //   JSZipUtils.getBinaryContent('data/geojsons.zip', function(err, data) {
  //       if (err) {
  //           reject(err);
  //       } else {
  //           resolve(data);
  //       }
  //   });
  // }).then(function (data) {
  //     return JSZip.loadAsync(data);
  // });

  // data loading promises
  const requests = [d3.json('data/gemeente.json'), d3.json('data/wijk.json')];

  Promise.all(requests).then(function(response) {
    console.log(response);

    let selection = d3.select(document.getElementById("map").contentDocument)
                      .selectAll("path");

    selection.each(function() {
      d3.select(this).on("click", function() {
        createLineGraph(response[0][this.getAttribute('cbs')]);
        document.getElementById("lineChart").innerHTML = "A line diagram appears here";
        document.getElementById("back").innerHTML = "<button type='button' onclick='toCountry()'>Back</button>";
      });
    });

    function dataChange(stat) {
      selection.each(function() {
        let score = response[0][this.getAttribute('cbs')][stat]
        d3.select(this).attr("fill", mapColours[score - 4])
      })
    }

    dataChange('KL16')

    let currentMode = 'KL16'
    d3.select('#changeMode').on("click", function() {
      if (currentMode === 'KL16') {
        dataChange('VKL0216');
        currentMode = 'VKL0216'
      } else {
        dataChange('KL16');
        currentMode = 'KL16';
      };
    });

    createPieGraph(response[0])

    // var y = response[2].file("WijkShapes.json").async("string");
    // var z = response[2].file("GemeenteShapes.json").async("string");

    // console.log("unpacking JSZip");
    // Promise.all([y, z]).then(function(resp) {
    //   var wijken = JSON.parse(resp[0]);
    //   var gemeentes = JSON.parse(resp[1]);
    //   console.log(wijken);
    //   console.log(gemeentes);
    // });
  });
}

function createPieGraph(data) {
  let w = 400,
    h = 400,
    r = 200;

  const svg = d3.select(".graphs")
      .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "pieChart")

  const g = svg.append("g")
      .attr("transform", `translate(${w / 2},${h / 2})`);

  let counter = {}
  for (let key in data) {
    counter[data[key]['KL16']] = counter[data[key]['KL16']] + 1 || 0;
  };

  let dataArray = []
  for (let number in counter) {
    let object = {}
    object["number"] = number;
    object["value"] = counter[number];
    dataArray.push(object)
  }

  let arcs = d3.pie().value(function(d) { return d.value; })
    .sort(function(a, b) { return a.number.localeCompare(b.number); })(dataArray);

  let arc = d3.arc()
      .innerRadius(0)
      .outerRadius(r)

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
  let w = 600,
    h = 300,
    margin = 25;

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
  console.log(dataArray);

  let xScale = d3.scaleLinear()
      .domain([2002, 2016])
      .range([margin, w - margin])

  let yScale = d3.scaleLinear()
      .domain([0, 10])
      .range([h - margin, margin]);

  let line = d3.line()
      .x(function(d) { return xScale(d.year); })
      .y(function(d) { return yScale(d.value); })
      .curve(d3.curveMonotoneX)

  let svg = d3.select("body").append("svg")
      .attr("width", w + 2 * margin)
      .attr("height", h + 2 * margin)

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (h - margin) + ")")
      .call(d3.axisBottom(xScale));

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin + ", 0)")
      .call(d3.axisLeft(yScale));

  svg.append("path")
      .datum(dataArray)
      .attr("class", "line")
      .attr("d", line);
}
