window.onload = function() {
  loadshp({
      url: 'Gemeente2016.zip', // path or your upload file
      encoding: 'big5' // default utf-8
  }, function(geojson) {
      console.log(geojson)
  });
}
