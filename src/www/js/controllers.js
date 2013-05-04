/**
 * Configure Controllers
 */

/*global angular, pyango_app */

pyango_app.controller('SongListController', function ($scope, Songs, AlertService, Confirm) {
    'use strict';
    // Handle Alert
    var alert = new AlertService($scope), removeSong;

    // Read the list of client from url
    $scope.songs = Songs.query(
        function () {
            alert.$success($scope.songs.length + " songs loaded.");
        },
        function (error) {
            alert.$resource_error("Failed to load song list.", error);
        }
    );

    // Delete client
    removeSong = function (song_oid, callback) {
        // callback will return a client_deleted flag
        var songs = $scope.songs;
        for ( var i = 0; i < songs.length; i++) {
            var song = songs[i];
            if ( song._id.$oid === song_oid ) {
                song.$remove(
                    { song_oid: song._id.$oid },
                    function () {
                        alert.$success("'" + song.name + "' deleted ")
                        songs.splice(i, 1);
                        if ( callback ) {
                            callback(true);
                        }
                    },
                    function (error) {
                        alert.$resource_error("Failed to delete '" + song.name + "'.", error);
                        if ( callback ) {
                            callback(false);
                        }
                    }
                );
                break;
            };
        };
    };

    $scope.askToRemoveSong = function (song_oid, song_name, callback) {
        // Callback is used for unit testing to confirm that clients array has be updated correctly
        Confirm("About to delete '" + song_name + "'.")
            .open()
            .then( function (result) {
                if ( result == "ok" ){
                    removeSong(song_oid, callback);
                }
            });
    };
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

//TODO: There is gotta be a way to pass arg to controller.  Tried ng-init but it did not work

pyango_app.controller('TypeAheadArtistController', function ($scope, ReferenceData) {
    'use strict';
    $scope.selected = undefined;
    $scope.artists = ReferenceData.query({ ref_data: "artist" });
});

pyango_app.controller('TypeAheadAlbumController', function ($scope, ReferenceData) {
    'use strict';
    $scope.selected = undefined;
    $scope.albums = ReferenceData.query({ ref_data: "album" });
});
pyango_app.controller('TypeAheadGenreController', function ($scope, ReferenceData) {
    'use strict';
    $scope.selected = undefined;
    $scope.genres = ReferenceData.query({ ref_data: "genre" });
});
