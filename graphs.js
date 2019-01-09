window.onload = function() {
  let gemeenteShape = new Promise(function(resolve, reject) {
    loadshp({
        url: 'data/Gemeente2016.zip', // path or your upload file
        encoding: 'big5' // default utf-8
    }, function(geojson) {
      resolve(geojson);
    });
  });

  let wijkShape = new Promise(function(resolve, reject) {
    loadshp({
        url: 'data/Wijk2016.zip', // path or your upload file
        encoding: 'big5' // default utf-8
    }, function(geojson) {
      resolve(geojson);
    });
  });

  let requests = [gemeenteShape, wijkShape, d3.json('data/Gemeente/score_gemeente.json'), d3.json('data/Wijk/wijk.json')];

  Promise.all(requests).then(function(response) {
    console.log(response)
  });
}

function mapClick() {
  document.getElementById("lineChart").innerHTML = "A line diagram appears here"
  document.getElementById("back").innerHTML = "<button type='button' onclick='toCountry()'>Back</button>"
}
