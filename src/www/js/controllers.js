/**
 * Configure Controllers
 */

/*global angular, pyango_app */

pyango_app.controller('SongListController', function ($scope, Songs, AlertService) {
    'use strict';
    // Handle Alert
    var alert = new AlertService($scope);
    // Read the list of client from url
    $scope.songs = Songs.query(
        function () {
            alert.$success($scope.songs.length + " songs loaded.");
        },
        function (error) {
            alert.$resource_error("Failed to load song list.", error);
        }
    );
});

pyango_app.controller('SongController', function ($scope, $route, $routeParams, $location, Songs, AlertService) {
    'use strict';
    // Handle Alert
    var alert = new AlertService($scope), addAction, saveAction;

    // Add song
    addAction = function () {
        $scope.song.$add(
            function () {
                alert.$success("New song '" + $scope.song.name + "' added.");
            },
            function (error) {
                alert.$resource_error("Failed to add a new song.", error);
            }
        );
    };

    // Save Song
    saveAction = function () {
        $scope.song.$save(
            { song_oid: $routeParams.song_oid },
            function () {
                alert.$success("'" + $scope.song.name + "' updated.");
                $location.path("#/list");
            },
            function (error) {
                alert.$resource_error("Failed to save the song.", error);
            }
        );
    };


    // Configure scope based on form mode
    if ($route.current.form_mode === 'add') {
        $scope.form_title = "Add a New Song";
        $scope.form_submit_caption = "Add";
        $scope.formSubmitAction = addAction;

        $scope.song = new Songs();
    } else {
        $scope.form_title = "Edit Song";
        $scope.form_submit_caption = "Save";
        $scope.formSubmitAction = saveAction;

        $scope.song = Songs.get(
            { song_oid: $routeParams.song_oid },
            angular.noop,
            function (error) {
                alert.$resource_error("Failed to retrieve song detail.", error);
            }
        );
    }

    // Cancel
    $scope.cancelAction = function () {
        $location.path("#/song");
    };

});
