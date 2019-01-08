function toPeriod() {
  let x = document.getElementById("year");
  let length = x.options.length;
  for (i = 0; i < length; i++) {
    x.remove(0);
  };

  let options = ["2002-2016", "2002-2008", "2008-2012", "2012-2014", "2014-2016"];
  length = options.length;
  for (i = 0; i < length; i++) {
    let option = document.createElement("option");
    option.text = options[i];
    option.value = options[i];
    x.add(option);
  };
  document.getElementById("changeMode").setAttribute("onclick", "toYear()");
}

function toYear() {
  let x = document.getElementById("year");
  let length = x.options.length;
  for (i = 0; i < length; i++) {
    x.remove(0);
  };

  let options = ["2002", "2008", "2012", "2014", "2016"];
  length = options.length;
  for (i = 0; i < length; i++) {
    let option = document.createElement("option");
    option.text = options[i];
    option.value = options[i];
    x.add(option);
  };
  document.getElementById("changeMode").setAttribute("onclick", "toPeriod()");
}
