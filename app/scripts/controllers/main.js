'use strict';

var app = angular.module('goEuro.search', ['ui.bootstrap']);

app.controller('GeoLocationCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {

  $scope.located = false;
  // default to berlin
  $rootScope.location = {
    name: 'berlin',
    coords: {
      longitude : 13.4105300,
      latitude: 52.5243700
    }
  };

  // google geocoding api
  var GEO_API = 'https://maps.googleapis.com/maps/api/geocode/json';
  // GET YOUR OWN API KEY HERE
  // https://developers.google.com/maps/documentation/geocoding/?csw=1#api_key
  var GEO_API_KEY = 'AIzaSyDQbVKaV45AVeS3BNQ6Oqy4StXFb4s9r-Y';

  // XXX more robust programs would use Modernizr
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoFail);
  }

  function geoFail(error) {
    console.error('could not locate the user', error);
  }

  // get the user's location and then
  // ask google for the name of the place they are at.
  function geoSuccess(result) {
    $scope.located = true;
    // we don't know the name yet, google will tell us
    $rootScope.location.name = 'unknown';
    $rootScope.location.coords = result.coords;
    // get the params
    var params = {
      latlng : [result.coords.latitude, result.coords.longitude].join(','),
      'result_type' : 'locality',
      key : GEO_API_KEY
    };

    // XXX do error handling if this wasn't a sketch
    // i don't have time for that right now.
    $http.get(GEO_API, { params : params})
      .success(function(response) {
        if (response.status === 'OK') {
          // get the first result
          if (response.results.length && response.results[0].address_components.length) {
            // XXX this is horrible ↑ and this also ↓
            $scope.location.name = response.results[0].address_components[0].short_name;
          }
        }
      });
  }

}]);


app.controller('DestinationSuggestionCtrl', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
  // goeuro api url
  var API_URL = 'http://www.goeuro.com/GoEuroAPI/rest/api/v2/position/suggest/de/';

  $scope.suggestions = [{
    fullName: 'type 2 or more characters'
  }];

  $scope.status = {
    isopen: false
  };


  $scope.setDestination = function(destination) {
    $scope.searchQuery = destination.fullName;
  };


  $scope.search = function(query) {

    if (!query) {
      return;
    }

    $http
      .get(API_URL + query)
      .success(function(results) {

        $scope.status = {
          isopen: (results.length > 0)
        };

        $scope.suggestions = results.map(function(r) {
          // see below for a simple distance calc on
          // earth
          r.distance = distance(
            $rootScope.location.coords.latitude,
            $rootScope.location.coords.longitude,
            r.geo_position.latitude,
            r.geo_position.longitude
          );

          return r;
        }).sort(function(a, b) {
          return a.distance - b.distance;
        });
      });
  };
}]);


app.controller('DatePickerCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
  $scope.setInitialDate = function(dayOffset) {
    $scope.dayOffset = dayOffset;
    $scope.dt = new Date(new Date().getTime() + (dayOffset*24*60*60*1000));
  };

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.setDate = function(date, propName) {
    $rootScope[propName] = date;
  };

  $scope.format = 'yyyy-MM-dd';

}]);

app.controller('SearchQueryCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {


}]);

// simple distance in km approx formula between two geo points
function distance(lat1, lon1, lat2, lon2) {
  var EARTH_RADIUS = 6373; // in km. this overestimates the poles but w/e

  // convert coordinates to radians
  lat1 *= Math.PI/180;
  lon1 *= Math.PI/180;
  lat2 *= Math.PI/180;
  lon2 *= Math.PI/180;

  var dlon = lon2 - lon1;
  var dlat = lat2 - lat1;

  var a = Math.pow(Math.sin(dlat/2), 2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2), 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = EARTH_RADIUS * c;

  return Math.floor(d); // round
}


