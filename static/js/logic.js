// geojson url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// production url
"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


// create the map object
var quakeMap = L.map("mapid", {
    center: [39, -98.5795],
    zoom: 7
});

// Base map creation
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attrib: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 19,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(quakeMap);

// get the data with d3

d3.json(url).then(function(qdata) {
    console.log(qdata)
    // for loop for new markers
    for (var x = 0; x < qdata.features.length; x++) {

        var qcoords = [qdata.features[x].geometry.coordinates[1], qdata.features[x].geometry.coordinates[0]]

        // colors for markers
        var color = '';
        var zaxis = qdata.features[x].geometry.coordinates[2];
        switch(true) {
            case (zaxis > -10 && zaxis < 10):
                color = 'rgb(34, 0, 255)'
                break;
            case (zaxis >= 10 && zaxis < 30):
                color = 'rgb(88, 25, 200)'
                break;
            case (zaxis >= 30 && zaxis < 50):
                color = 'rgb(150, 34, 180)'
                break;
            case (zaxis >= 50 && zaxis < 70):
                color = 'rgb(198, 55, 162)'
                break;
            case (zaxis >=70 && zaxis < 90):
                color = 'rgb(237, 68, 149)'
                break;
            case (zaxis >= 90):
                color = 'rgb(266, 75, 100)'
                break;
        }
    
    // popups!
    var date = moment(qdata.features[x].properties.time).format('YYYY-DD-MM')
    var time = moment(qdata.features[x].properties.time).format('hh:mm:ss a')
    var loc = qdata.features[x].properties.place
    var mag = qdata.features[x].properties.mag

    // circles for reports
    L.circle(qcoords, {
        opacity: 0.3,
        fillOpacity: 0.6,
        weight: 0.4,
        color: 'black',
        fillColor: color,
        radius: 5500 * qdata.features[x].properties.mag
    }).bindPopup(`<p align = "left"> <strong>Date:</strong> ${date} <br> <strong>Time:</strong>${time} <br>
      <strong>Location:</strong> ${loc} <br> <strong>Magnitude:</strong> ${mag} </p>`).addTo(quakeMap)

    newMarker = L.tileLayer
}});

var legend = L.control({position: 'topright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
    var colors = [
        'rgb(19, 235, 45)',
        'rgb(138, 206, 0)',
        'rgb(186, 174, 0)',
        'rgb(218, 136, 0)',
        'rgb(237, 91, 0)',
        'rgb(242, 24, 31)'
        ];
    labels = [];

    // create label based on depth intervals
    grades.forEach(function(grade, index) {
        labels.push("<div class = 'row'><li style=\"background-color: " + colors[index] +  "; width: 20px"+ "; height: 15px" + "\"></li>" + "<li>" + grade + "</li></div>");
    })

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;

};

legend.addTo(quakeMap);