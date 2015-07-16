$(function() {

  window.IronhackerMap = function() {
    var styles = [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}]

    var mapOptions = {
      zoom: 4, 
      scrollwheel: false,
      center: new google.maps.LatLng(41.3917782, 2.1772809999999936),
      styles: styles
    };
    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    this.locations = []
    this.bounds = new google.maps.LatLngBounds();

  };

  IronhackerMap.prototype.addMarker = function(location, name) {

    var marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: name
    });
    this.bounds.extend(marker.position)
    this.repositionMap(location);
  };

  IronhackerMap.prototype.addLocation = function(location) {
    this.locations.push(location);
  };

  IronhackerMap.prototype.getCoords = function(address, name, callback) {

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address' : address}, function(response, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var lat = response[0].geometry.location.A
        var lon = response[0].geometry.location.F
        var latLng = new google.maps.LatLng(lat, lon)
        callback(latLng, name);
      } else {
        alert("There was something wrong with your address");
      };
    });
  };

  IronhackerMap.prototype.repositionMap = function(location) {
    this.map.setCenter(location);
    this.map.setZoom(15);
  };

  IronhackerMap.prototype.resizeMap = function() {
    this.map.fitBounds(this.bounds);
  };

  IronhackerMap.prototype.addListeners = function() {
    $("#submit").on("click", function() {
      var address = $("#address").val();
      var name = $("#name").val();
      this.addLocation(address);
      this.getCoords(address, name, this.addMarker.bind(this));
    }.bind(this));


    $("#done").on("click", this.resizeMap.bind(this));
  };

  IronhackerMap.prototype.visitEveryone = function() {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var start = this.locations[0];
    var waypoints = this.locations
    var request = {
          origin:start,
          destination:start,
          waypoints: waypoints,
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });
    directionsDisplay.setMap(this.map);

  }

  window.ironMap = new IronhackerMap();
  ironMap.addListeners();

})


function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

