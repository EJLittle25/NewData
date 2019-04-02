var geojson;
var legend;
console.log(countriesData)
////////////////////////////////////////////////////////////////
//                  MAKE THE MAP                              //
////////////////////////////////////////////////////////////////

var map = L.map('map', {minZoom: 2, maxZoom: 18
})

map.setView([15, 10.784020], 1.5);
////////////////////////////////////////////////////////////////
//                  GET MAPBOX TILE LAYER                     //
////////////////////////////////////////////////////////////////
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1IjoiZWpsaXR0bGUyNSIsImEiOiJjanRwemVrMDcwMXdnM3lwZTJjdDM3dmxxIn0.4MgCbKRV5UjSxfvLMfZg3w'
}).addTo(map);


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Happiness Score</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.hap + '</b><br />'
        : 'Hover over a country');
};

info.addTo(map);


// get color depending on population density value
function getColor(d) {
    return d > 7.5 ? '#FFCCFF' :
            d > 7  ? '#FFAAF1' :
            d > 6.5 ? '#FF88D1' :
            d > 6  ? '#FF66A4' :
            d > 5.5   ? '#FF446B' :
            d > 5   ? '#FF2228' :
            d > 4.5   ? '#FF2500' :
            d > 4   ? '#CF4900' :
            d > 3.5   ? '#9E5B00' :
            d > 3   ? '#6E5900' :
            d > 2.5   ? '#3D3D00' :
                        '#FFEDA0';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.hap)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    info.update(layer.feature.properties);
}


function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(countriesData,{
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

////////////////////////////////////////////////////////////////
//                  CREATE THE LEGEND                         //
////////////////////////////////////////////////////////////////
legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);