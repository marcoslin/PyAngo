/**
 * Initialize angular application and define application routing
 */

/*global angular */

var pyango_app = angular.module("pyango.app", ["jsonServices", "guiServices"]);

/**
 * Configure Application Route
 */
pyango_app.config(function ($routeProvider) {
    'use strict';
    $routeProvider
        .when("/songs/:page_num", { templateUrl: "template/song_list.html", controller: 'SongListController' })
        .when("/song/add", { templateUrl: "template/song_detail.html", controller: 'SongController', form_mode : 'add' })
        .when("/song/:song_oid", { templateUrl: "template/song_detail.html", controller: 'SongController', form_mode : 'edit' })
        .otherwise({redirectTo: '/songs/'});
});
