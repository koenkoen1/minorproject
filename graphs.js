let mapColours = ['#ffffcc','#d9f0a3','#addd8e','#78c679','#31a354','#006837']

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
  let requests = [d3.json('data/gemeente.json'), d3.json('data/wijk.json')];

  Promise.all(requests).then(function(response) {
    console.log(response);

    let selection = d3.select(document.getElementById("map").contentDocument)
                      .selectAll("path");
    selection.each(function() {
      let score = response[0][this.getAttribute('cbs')]['KL16']
      d3.select(this).attr("fill", mapColours[score - 4])
          .attr("onclick", "mapClick()")
    })

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
  let w = 500,
  h = 500,
  r = 250;

  const svg = d3.select(".graphs")
      .append("svg")              //create the SVG element inside the <body>
          .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
          .attr("height", h)
          .attr("class", "pieChart")

  const g = svg.append("g")
      .attr("transform", `translate(${w / 2},${h / 2})`);

  let counter = {}
  for (var key in data) {
    counter[data[key]['KL16']] = counter[data[key]['KL16']] + 1 || 0;
  };

  dataArray = []
  for (number in counter) {
    let object = {}
    object["number"] = number;
    object["value"] = counter[number];
    dataArray.push(object)
  }

  let arcs = d3.pie().value(function(d) { return d.value; })
    .sort(function(a, b) { return a.number.localeCompare(b.number); })(dataArray);

  var arc = d3.arc()
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

function mapClick() {
  document.getElementById("lineChart").innerHTML = "A line diagram appears here";
  document.getElementById("back").innerHTML = "<button type='button' onclick='toCountry()'>Back</button>";
}
