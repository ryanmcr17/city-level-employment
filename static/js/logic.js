// save API endpoint
const baseUrl = "http://127.0.0.1:5000";
const APIurl = baseUrl + "/USCityUnemploymentDATA";
console.log('APIurl = ' + APIurl);


// D3 request to the API URL
d3.json(APIurl).then(APIresponse => createUnemploymentMap(APIresponse));
console.log('APIresponse = ' + APIresponse);



// function to define/create the features (specific earthquakes) and to create the map
function createUnemploymentMap(city_data) {

  console.log('API response / city_data = ' + city_data);

  let cityMarkers = [];
  let cityMarkers2 = [];

  // loop through the earthquakes/'features' array creating a new circle marker with detailed popup for each quake and pushing them into the quakeMarkers array
  for (let i = 0; i < Object.keys(city_data).length; i++) {

    let city = city_data[i];
    console.log('city object = ' + city);

    let name = city.city;
    console.log('city name = ' + name);

    let coordinates = [city.latitude,city.longitude];
    console.log('Coordinates = ' + coordinates);

    let population = Number(city.population);
    let population_string = population.toLocaleString();
    console.log('population = ' + population);
    console.log('population_string = ' + population_string);

    let unemploymentRate = city.unemploymentRate;
    console.log('unemploymentRate = ' + unemploymentRate);

    let unemploymentCount = Number(city.unemploymentCount);
    let unemploymentCount_string = unemploymentCount.toLocaleString();
    console.log('unemploymentCount = ' + unemploymentCount);
    console.log('unemploymentCount_string = ' + unemploymentCount_string);

    
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
      fillOpacity: 0.75,
      fillColor: colorBasedOnRate,
      radius: Math.sqrt(population)*40,
      stroke: true,
      color: "black",
      weight: 0.5
    };
    
    // create circle marker based on coordinates + attributes dict, with detailed popup showing additional info
    cityMarkers.push(
      L.circle(coordinates, featureAttributes)
      .bindPopup(`<h3>${name}</h3><hr>
      Unemployment Rate (August 2023): ${unemploymentRate}%<br>
      Unemployment Count (August 2023): ${unemploymentCount_string}`)
    );



    // save attributes dict/JSON for circle marker
    let featureAttributes2 = {
      fillOpacity: 0.75,
      fillColor: colorBasedOnRate,
      radius: Math.pow(unemploymentRate,2.5)*1000,
      stroke: true,
      color: "black",
      weight: 0.5
    };
    
    // create circle marker based on coordinates + attributes dict, with detailed popup showing additional info
    cityMarkers2.push(
      L.circle(coordinates, featureAttributes2)
      .bindPopup(`<h3>${name}</h3><hr>
      Unemployment Rate (August 2023): ${unemploymentRate}%<br>
      Unemployment Count (August 2023): ${unemploymentCount_string}`)
    );




  }


  // create overlay layer from quakeMarkers array
  let cityLayer = L.layerGroup(cityMarkers);
  let cityLayer2 = L.layerGroup(cityMarkers2);


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
    "Unemployment Data, Top 100 US Cities (size represents population)": cityLayer,
    "Unemployment Data, Top 100 US Cities (size represents unemployment rate)": cityLayer2,
  };


  // create map, passing streetmap and earthquakes layers to display on load, showing the entire world centered on [0,0]
  let myMap = L.map("map", {
    center: [39.8355, -99.0909],
    zoom: 4,
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
    div.style.padding = "0px 10px 10px";
    div.innerHTML = '<h3>Unemployment Rate<br>(August 2023)</h3><svg width="10" height="10"><rect width="10" height="10" fill="#663399"/></svg>  0-1%<br><svg width="10" height="10"><rect width="10" height="10" fill="#0000FF"/></svg>  1-2%<br><svg width="10" height="10"><rect width="10" height="10" fill="#006400"/></svg>  2-3%<br><svg width="10" height="10"><rect width="10" height="10" fill="#FFFF00"/></svg>  3-4%<br><svg width="10" height="10"><rect width="10" height="10" fill="#FFA500"/></svg>  4-5%<br><svg width="10" height="10"><rect width="10" height="10" fill="#FF0000"/></svg>  >5%<br>';
    return div;        
  };

  legend.addTo(myMap);


  // create layer control with baseMaps and overlayMaps objects and add it to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


};
