window.onload = function() {
  var shapesZip = new JSZip.external.Promise(function (resolve, reject) {
    JSZipUtils.getBinaryContent('data/geojsons.zip', function(err, data) {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    });
  }).then(function (data) {
      return JSZip.loadAsync(data);
  });

  let requests = [d3.json('data/Gemeente/score_gemeente.json'), d3.json('data/Wijk/wijk.json'), shapesZip)];

  Promise.all(requests).then(function(response) {
    console.log(response);

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

function createMap(data) {
  // width and height
  var w = 600,
      h = 700;

  // var geojson = topojson.feature(data, data.objects.GemeenteShapes)
  // console.log(geojson)

  // define map projection
  var projection = d3.geoMercator().scale(6700)

  //Define default path generator
  var path = d3.geoPath()
    .projection(projection);

  var b = path.bounds(data.features[3]),
  s = .2 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
  t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];

  projection
          .scale(s * 4000000)
          .translate(t);

  var svg = d3.select("body")
    .append("svg")
    .attr("id", "map")
    .attr("width", w)
    .attr("height", h)

  svg.selectAll("path")
          .data(data.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill", "none")
          .style("stroke", "black");

  console.log("done")
}

function mapClick() {
  document.getElementById("lineChart").innerHTML = "A line diagram appears here";
  document.getElementById("back").innerHTML = "<button type='button' onclick='toCountry()'>Back</button>";
}
