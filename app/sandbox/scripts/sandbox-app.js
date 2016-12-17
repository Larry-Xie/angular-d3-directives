// Copyright © Citrix Systems, Inc.  All rights reserved.
'use strict';

var app = angular.module('cwc.sandbox', [
    'cwc.d3',
    'cwc.hanglide',
    'ngAnimate',
    'ngSanitize',
    'ngRoute',
    'ui.router',
    'ui.bootstrap',
    'ui.bootstrap.tabs',
    'ui.bootstrap.tpls',
]).config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $stateProvider.state('/', {
                url: '/',
                abstract: true,
                templateUrl: 'sandbox/views/navigation.html'
            })
            .state('home', {
                url: 'home',
                parent: '/',
                templateUrl: 'sandbox/views/home.html'
            })
            .state('examples', {
                url: 'examples',
                parent: '/',
                templateUrl: 'sandbox/views/example.html'
            })
            .state('404', {
                url: '/404',
                templateUrl: '404'
            });
        $urlRouterProvider.otherwise('/home');
    }
]);
