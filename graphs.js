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

  let requests = [d3.json('data/Gemeente/score_gemeente.json'), d3.json('data/Wijk/wijk.json'), shapesZip];

  Promise.all(requests).then(function(response) {
    console.log(response);
    var y = response[2].file("WijkShapes.json").async("string");
    var z = response[2].file("GemeenteShapes.json").async("string");

    console.log("unzipping JSZip");
    Promise.all([y, z]).then(function(resp) {
      var wijken = JSON.parse(resp[0]);
      var gemeentes = JSON.parse(resp[1]);
      console.log(wijken);
      console.log(gemeentes);
    });
  });
}

function mapClick() {
  document.getElementById("lineChart").innerHTML = "A line diagram appears here";
  document.getElementById("back").innerHTML = "<button type='button' onclick='toCountry()'>Back</button>";
}
