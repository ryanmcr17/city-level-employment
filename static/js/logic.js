

let json_div_element = d3.select("#json");
console.log(json_div_element);

let json_div_html = json_div_element.html;
console.log(`json_div_html = ${json_div_html}`);

let json_div_text = json_div_element.text;
console.log(`json_div_text = ${json_div_text}`);

let json2 = JSON.parse(json_div_text);
console.log(`json2 = ${json2}`);



let json_div_attr_data_value = json_div_element.attr('data-value');
console.log(`json_div_attr_data_value = ${json_div_attr_data_value}`);


console.log(json_div_element.items())

createUnemploymentMap(json_city_data_from_sqlite_db);


// function to define/create the features (specific earthquakes) and to create the map
function createUnemploymentMap(json_city_data) {


  let cityMarkers = [];

  // loop through the earthquakes/'features' array creating a new circle marker with detailed popup for each quake and pushing them into the quakeMarkers array
  for (let i = 0; i < Object.keys(json_city_data).length; i++) {

    let city = json_city_data[i];
    console.log('city object = ' + city);

    let name = city.city;
    console.log('city name = ' + name);

    let coordinates = [city.latitude,city.longitude];
    console.log('Coordinates = ' + coordinates);

    let population = city.population;
    console.log('population = ' + population);

    let unemploymentRate = city.unemploymentRate;
    console.log('unemploymentRate = ' + unemploymentRate);

    let unemploymentCount = city.unemploymentCount;
    console.log('unemploymentCount = ' + unemploymentCount);

    
    let colorBasedOnRate = '';

    // determine color to use based on depth of quake
    if (unemploymentRate < 1) {
      colorBasedOnRate = '#663399';
    }   else if (unemploymentRate < 2) {
      colorBasedOnRate = '#0000FF';
    }   else if (unemploymentRate < 3) {
      colorBasedOnRate = '#006400';
    }   else if (unemploymentRate < 4) {
      colorBasedOnRate = '#FFFF00';
    }   else if (unemploymentRate < 5) {
      colorBasedOnRate = '#FFA500';
    }   else {
      colorBasedOnRate = '#FF0000';
    };
    console.log('colorBasedOnRate = ' + colorBasedOnRate);

    // save attributes dict/JSON for circle marker
    let featureAttributes = {
      stroke: false,
      fillOpacity: 0.75,
      color: "black",
      fillColor: colorBasedOnRate,
      radius: population
    };
    
    // create circle marker based on coordinates + attributes dict, with detailed popup showing additional info
    cityMarkers.push(
      L.circle(coordinates, featureAttributes)
      .bindPopup(`<h3>${name}</h3><hr>
      Population: ${population}<br>
      Unemployment Rate (August 2023): ${unemploymentRate}<br>
      Unemployment Count (August 2023): ${unemploymentCount}<br>
      Coordinates: ${coordinates}`)
    );

  }


  // create overlay layer from quakeMarkers array
  let cityLayer = L.layerGroup(cityMarkers);


  // create base layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


  // create baseMaps object
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };


  // create overlayMaps object to hold our quakeLayer of earthquake markers with popups
  let overlayMaps = {
    "Unemployment Data for Top 100 US Cities by Population": cityLayer
  };


  // create map, passing streetmap and earthquakes layers to display on load, showing the entire world centered on [0,0]
  let myMap = L.map("map", {
    center: [
      0,0
    ],
    zoom: 2,
    layers: [street, cityLayer]
  });

  
  // add a legend showing how the marker colors represent earthquake depth

  var legend = L.control({
    position: 'bottomright'
  });

  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'unemployment legend');
    div.style.backgroundColor = "white";
    div.style.border = "thin solid black";
    div.innerHTML = '<h3>Unemployment rate (km)</h3><svg width="10" height="10"><rect width="10" height="10" fill="#663399"/></svg>  0-1%<br><svg width="10" height="10"><rect width="10" height="10" fill="#0000FF"/></svg>  1-2%<br><svg width="10" height="10"><rect width="10" height="10" fill="#006400"/></svg>  2-3%<br><svg width="10" height="10"><rect width="10" height="10" fill="#FFFF00"/></svg>  3-4%<br><svg width="10" height="10"><rect width="10" height="10" fill="#FFA500"/></svg>  4-5%<br><svg width="10" height="10"><rect width="10" height="10" fill="#FF0000"/></svg>  >5%<br>';
    return div;        
  };

  legend.addTo(myMap);


  // create layer control with baseMaps and overlayMaps objects and add it to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


};
