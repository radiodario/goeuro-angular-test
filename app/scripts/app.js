'use strict';

angular.module('goEuro', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'goEuro.search'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
