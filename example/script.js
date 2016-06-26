require([
  "esri/geometry/Point",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/TextSymbol",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/Map",
  "esri/PopupTemplate",
  "dojo/domReady!"
], function(Point, SimpleMarkerSymbol, TextSymbol, MapView, Graphic, Map, PopupTemplate) {

  if(navigator.geolocation) {
    new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(function(position){
        resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      });
    }).then(function(coords) {
      window.mapView.goTo({
        target: [coords.longitude, coords.latitude],
        zoom: 14
      },
      {
        duration: 3000,
        easing: 'ease-in-out'
      });
    });
  }

  window.mapView = new MapView({
    container: "viewDiv",
    map: new Map({
      basemap: "topo"
    }),
    center: [-121.42, 47.42],
    zoom: 4
  });

  window.defaultSymbol = new SimpleMarkerSymbol({
    style: 'circle',
    color: 'blue',
    size: '10px'
  });

  window.mapView.on('click', function(event) {
    document.newPointForm.latitude.value = event.mapPoint.latitude;
    document.newPointForm.longitude.value = event.mapPoint.longitude;

    document.newPointForm.style.visibility = "visible";
    document.newPointForm.name.focus();
  });

  document.newPointForm.onsubmit = function(event) {
    var coords = {
      latitude: event.target.latitude.value,
      longitude: event.target.longitude.value
    };

    window.mapView.graphics.add(new Graphic({
      geometry: new Point(coords),
      symbol: window.defaultSymbol,
    }));

    window.mapView.graphics.add(new Graphic({
      geometry: new Point(coords),
      symbol: new TextSymbol({
        color: 'black',
        text: event.target.name.value,
        yoffset: 6
      })
    }));

    event.target.style.visibility = "hidden";
    event.target.reset();
    return false;
  };

  document.newPointForm.cancel.onclick = function(event) {
    document.newPointForm.reset();
    document.newPointForm.style.visibility = "hidden";
  };
});
