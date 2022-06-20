const stopsHT = document.querySelector("#stops");
const searchbar = document.querySelector("[data-search]");
const mode = document.querySelector(".mode");
const stopsList = document.querySelector(".stopsList");
const stopTitle = document.querySelector(".stopTitle");

function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
}

readTextFile("./stops.json", function (text) {
  var data = JSON.parse(text);
  data.stopGroups.forEach(function (stopGroup) {
    var option = document.createElement("div");
    option.innerHTML = stopGroup.name;
    var stops = stopGroup.stops;
    option.data = "";
    stops.forEach(function (stop) {
      stop.lines.forEach(function (line) {
        var type = line.type.charAt(0).toUpperCase() + line.type.slice(1);
        if (option.data.indexOf(line.name) === -1) {
          option.data += `${type}${line.name} `;
        }
      });
    });
    stopsHT.appendChild(option);
  });
});

function getLinks(number) {
  var links = [];
  /* 
  stopsList.innerHTML = "";
  readTextFile("./stops.json", function (text) {
    var data = JSON.parse(text);
    data.stopGroups.forEach(function (stopGroup) {
      var lineHT = document.createElement("div");
      lineHT.data = "";
      stopGroup.stops.forEach(function (stop) {
        stop.lines.forEach(function (line) {
          var type = line.type.charAt(0).toUpperCase() + line.type.slice(1);
          if (lineHT.data.indexOf(line.name) === -1) {
            lineHT.data += `${type}${line.name} `;
          }
          if (line.id.toString() === number.toString()) {
            if (links.indexOf(stopGroup.name) === -1) {
              links.push(stopGroup.name);
              lineHT.innerHTML = stopGroup.name;
              lineHT.classList.add("stopGroup");
              stopsList.appendChild(lineHT);
            }
          }
        });
      });
    });
  });
  */
}

function getStops(target) {
  stopsList.innerHTML = "";
  var data = target.data.split(/\s+/);
  data.forEach(function (line) {
    var lineHT = document.createElement("div");
    lineHT.innerHTML = line.replace(/([0-9]+)/g, " $1");
    stopTitle.innerHTML = target.innerHTML;
    stopsList.appendChild(lineHT);
  });
  stopsList.lastChild.remove();
}

stopsHT.addEventListener("click", function (e) {
  getStops(e.target);
});

searchbar.addEventListener("input", function (e) {
  var search = e.target.value.toLowerCase();
  var options = stopsHT.querySelectorAll("div");
  options.forEach(function (option) {
    if (option.innerHTML.toLowerCase().indexOf(search) > -1) {
      option.style.display = "flex";
    } else {
      option.style.display = "none";
    }
  });
});

stopsList.addEventListener("click", function (e) {
  if (e.target.classList.contains("stopGroup")) {
    getStops(e.target);
  } else {
    var number = e.target.innerHTML.match(/\d+/g);
    if (number) {
      number = number[0];
      getLinks(number);
    }
  }
});
