// The Google Map.
var map;
var geoJsonOutput;
var downloadLink;
var x;
var linestrings = [];

function init() {
  // Initialise the map.
  map = new google.maps.Map(document.getElementById('map-holder'), {
    center: {lat: 39.62234381500646, lng: 19.91782828220289 },
    zoom: 16,
    mapTypeControl: true,
    mapTypeId: 'satellite',
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER
    },
    zoomControl: true,
    scaleControl: true,
    streetViewControl: true,
    fullscreenControl: false
  });

  map.data.loadGeoJson('data/2016141_review.geojson')

  map.data.setControls(['Point', 'LineString', 'Polygon']);
  map.data.setStyle({
    editable: true,
    draggable: true,
    clickable: true
  });


  bindDataLayerListeners(map.data);

  map.data.addListener('rightclick', function(event){
        map.data.remove(event.feature);
    });

  // Retrieve HTML elements.
  var mapContainer = document.getElementById('map-holder');
  geoJsonOutput = document.getElementById('geojson-output');
  downloadLink = document.getElementById('download-link');

  //reading back the new color value
  map.data.setStyle(function(feature) {
    var default_color = "#000000";
    if (feature.getProperty("Color")!=x){
        default_color = feature.getProperty("Color");
      }
      else if(feature.getProperty("Color")==null){
          feature.setProperty("Color", x);
      }
      return ({strokeColor: default_color});
});

//temporarily changes the color of the path that the user has moused over.
map.data.addListener('mouseover',function(event){
  map.data.overrideStyle(event.feature, {strokeOpacity: 0.5});
});

map.data.addListener('mouseout',function(event){
  map.data.overrideStyle(event.feature, {strokeOpacity: 1});
});

}

google.maps.event.addDomListener(window, 'load', init);

// Refresh different components from other components.
function refreshGeoJsonFromData() {
  map.data.toGeoJson(function(geoJson) {
    geoJsonOutput.value = JSON.stringify(geoJson) ;
    refreshDownloadLinkFromGeoJson();
  });
}

// Refresh download link.
function refreshDownloadLinkFromGeoJson() {
  downloadLink.href = "data:;base64," + btoa(geoJsonOutput.value);
}

// Apply listeners to refresh the GeoJson display on a given data layer.
function bindDataLayerListeners(dataLayer) {
  dataLayer.addListener('addfeature', refreshGeoJsonFromData);
  dataLayer.addListener('removefeature', refreshGeoJsonFromData);
  dataLayer.addListener('setgeometry', refreshGeoJsonFromData);
  dataLayer.addListener('setproperty', refreshGeoJsonFromData);

var rating_counter = 1;
  map.data.addListener('click', function(event) {
          if(rating_counter == 0)
             selected_color(event, '#000000');
          else if(rating_counter == 1)
            selected_color(event, '#ff0000');
          else if(rating_counter == 2)
            selected_color(event, '#ff8100');
          else if(rating_counter == 3)
            selected_color(event, '#e3ff00');
          else if(rating_counter == 4)
            selected_color(event, '#004c00');
          else if(rating_counter == 5)
            selected_color(event, '#00FF00');
        rating_counter++;
        if(rating_counter>5)
          rating_counter = 0;
    });
}

function geoJSONToggle() {
    var toggle = document.getElementById("geojson-output");

      if (toggle.style.display == "block") {
        toggle.style.display = "none";
      }
      else{
        toggle.style.display = "block";
    }
}

function deleteAll() {
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });
}

function selected_color(event, x){
    color = x;
    map.data.overrideStyle(event.feature,{strokeColor: x});
    event.feature.setProperty("Color", x);
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
