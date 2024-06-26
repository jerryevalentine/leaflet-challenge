let myMap = L.map("map", {
  center: [20, 0], 
});


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(myMap);

//Use these colors - #d73027 is read
function getColor(magnitude) {
  return magnitude > 5 ? '#d73027' :
         magnitude > 4 ? '#fc8d59' :
         magnitude > 3 ? '#fee08b' :
         magnitude > 2 ? '#d9ef8b' :
         magnitude > 1 ? '#91cf60' :
                         '#1a9850';
}

// This gets the earthquake data from the USGS used in the map
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
  .then((data) => {
    let markers = L.markerClusterGroup();

    data.features.forEach((feature) => {
      let coordinates = feature.geometry.coordinates;
      let properties = feature.properties;

      let marker = L.circleMarker([coordinates[1], coordinates[0]], {
        radius: properties.mag * 2, // size of the marker based on magnitude
        fillColor: getColor(properties.mag), // color based on magnitude
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });

      marker.bindPopup(
        `<strong>Location:</strong> ${properties.place}<br>
         <strong>Magnitude:</strong> ${properties.mag}<br>
         <strong>More Info:</strong> <a href="${properties.url}" target="_blank">USGS Link</a>`
      );

      markers.addLayer(marker);
    });

    myMap.addLayer(markers);
  })
//This catches any errors and prints in the console.
  .catch((error) => {
    console.error("Error fetching earthquake data:", error);
  });
