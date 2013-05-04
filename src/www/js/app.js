/**
 * Initialize angular application and define application routing
 */
client_app = angular.module("pyango.app", ["jsonServices", "guiServices"]);

/**
 * Configure Application Route
 */
client_app.config(function ($routeProvider) {
    $routeProvider.
        when("/song", { templateUrl: "template/song_list.html", controller: 'SongListController' }).
        when("/song/:song_oid", { templateUrl: "template/song_detail.html", controller: 'SongController', form_mode : 'edit' }).
        otherwise({redirectTo: '/song'});
});
