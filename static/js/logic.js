// save API endpoint
const baseUrl = "http://127.0.0.1:5000";
const APIurl = baseUrl + "/USCityUnemploymentDATA";
console.log('APIurl = ' + APIurl);


// D3 request to the Flask API URL
d3.json(APIurl).then(APIresponse => createUnemploymentMap(APIresponse)).catch(console.log("No response from the API - make sure the Flask API is active/serving"));
console.log('APIresponse = ' + APIresponse);



// function to define/create the map markers (specific cities with unemployment data) and to create the map
function createUnemploymentMap(city_data) {

  console.log('API response / city_data = ' + city_data);

  let cityMarkers = [];
  let cityMarkers2 = [];

  // loop through the city data provided by the API in JSON format to create a new circle marker with popup for each city
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

    // determine color to use based on unemployment rate
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

    // save attributes dict for first set of circle markers
    let featureAttributes = {
      fillOpacity: 0.75,
      fillColor: colorBasedOnRate,
      radius: Math.sqrt(population)*40,
      stroke: true,
      color: "black",
      weight: 0.5
    };
    
    // create first set of circle markers based on coordinates + attributes dict
    cityMarkers.push(
      L.circle(coordinates, featureAttributes)
      .bindPopup(`<h3>${name}</h3><hr>
      Unemployment Rate (August 2023): ${unemploymentRate}%<br>
      Unemployment Count (August 2023): ${unemploymentCount_string}`)
    );

// save attributes dict for second set of circle markers
    let featureAttributes2 = {
      fillOpacity: 0.75,
      fillColor: colorBasedOnRate,
      radius: Math.pow(unemploymentRate,2.5)*1000,
      stroke: true,
      color: "black",
      weight: 0.5
    };
    
    // create second set of circle markers based on coordinates + attributes dict
    cityMarkers2.push(
      L.circle(coordinates, featureAttributes2)
      .bindPopup(`<h3>${name}</h3><hr>
      Unemployment Rate (August 2023): ${unemploymentRate}%<br>
      Unemployment Count (August 2023): ${unemploymentCount_string}`)
    );

  }


  // create overlay layers from each set of city markers
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


  // create overlayMaps object to display city-unemployment layers of circle markers
  let overlayMaps = {
    "Unemployment Data, Top 100 US Cities (size represents population)": cityLayer,
    "Unemployment Data, Top 100 US Cities (size represents unemployment rate)": cityLayer2,
  };


  // create map, passing streetmap and first layer of city-unemployment circle markers to display on load, centered on the continental US
  let myMap = L.map("map", {
    center: [39.8355, -99.0909],
    zoom: 4,
    layers: [street, cityLayer]
  });

  
  // add a legend showing how the marker colors represent unemployment depth

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





  let names = [];
  let rates = [];

  // loop through the city data provided by the API in JSON format to create a new circle marker with popup for each city
  for (let i = 0; i < Object.keys(city_data).length; i++) {

    let city = city_data[i];
    console.log('city object = ' + city);

    let name = city.city;
    console.log('city name = ' + name);

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

    names.push(name)
    rates.push(unemploymentRate)

  // define arrays containing OTU IDs, OTU labels, and sample values for top 10 OTUs by sample value
  var top10CityNames = names.slice(0,10).reverse();
  var top10Cityrates = rates.slice(0,10).reverse();

  // define trace for horizontal bar chart
  var barTrace1 = {
      x: top10Cityrates,
      y: top10CityNames,
      name: "Unemployment Rate: Top 10 Cities by Population",
      type: "bar",
      orientation: "h"
  };

  // set traces/data to be plotted
  var barTraces = [barTrace1];

  // set layout
  var barLayout = {
  title: "Unemployment Rate: Top 10 Cities by Population",
  margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
  }
  };

  // render plot to <div id="bar"≥
  Plotly.newPlot("bar", barTraces, barLayout);

  };

};