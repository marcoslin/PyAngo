/**
 * Configure Controllers
 */

/*global angular, pyango_app */

pyango_app.controller('SongListController', function ($scope, $routeParams, Songs, SongsNavigation, AlertService, Confirm) {
    'use strict';
    // Define Paging
    var songsPageNumber = SongsNavigation.getSongsPageNumber();
    $scope.maxPagesBlocks = 15;
    $scope.search_by = "search";

    if (songsPageNumber) {
        $scope.page_num = songsPageNumber;
    } else {
        $scope.page_num = 1;
    }

    // Handle Alert
    var alert = new AlertService($scope), removeSong, queryPage;

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

    // When User click delete
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

    // Search related
    $scope.searchFormSubmit = function () {
        alert.$success("Searching for " + $scope.search_term + " using " + $scope.search_by);
        loadSongs();
    };

    // Populate Data
    var loadSongs = function () {
        var query_param = { page_num: $scope.page_num }

        if ($scope.search_term) {
            query_param[$scope.search_by] = $scope.search_term;
        }

        if ($scope.sortField) {
            query_param.sort_by = $scope.sortField;
            query_param.sort_asc = $scope.sortAsc;
        }

        var song_page = Songs.get(
            query_param,
            function () {
                $scope.totalPages = song_page.total_pages;
                $scope.songs = song_page.rows;
                alert.$success($scope.songs.length + " songs loaded for page " + $scope.page_num + ".");
            },
            function (error) {
                alert.$resource_error("Failed to load song list.", error);
            }
        );
    };

    // Watch for change in the page_num and change route to that page
    $scope.$watch('page_num', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            SongsNavigation.setSongsPageNumber($scope.page_num);
            loadSongs();
        }
    });


    // Sort Result
    $scope.setSortBy = function(sortField) {
        if ($scope.sortField === sortField && $scope.sortAsc === 0) {
            $scope.sortField = undefined;
            $scope.sortAsc = undefined;
        } else {
            console.log("sortField: " + sortField);
            if ($scope.sortField === undefined) {
                $scope.sortAsc = 1;
            } else if ($scope.sortField === sortField) {
                $scope.sortAsc = 0;
            } else if ($scope.sortAsc === undefined) {
                $scope.sortAsc = 1;
            } else if ($scope.sortAsc === 1) {
                $scope.sortAsc = 0;
            } else {
                $scope.sortAsc = 1;
            }
            $scope.sortField = sortField;
        }
        loadSongs();
    };
    $scope.getSortImageName = function ( fieldName ) {
        var no_sort = "sort_both.png";
        if ( $scope.sortField === undefined ) {
            return no_sort;
        } else {
            if ( $scope.sortField === fieldName ) {
                if ($scope.sortAsc === 1) {
                    return "sort_asc.png";
                } else {
                    return "sort_desc.png";
                }
            } else {
                return no_sort;
            }
        }
    };

    loadSongs();


});

pyango_app.controller('SongController', function ($scope, $route, $routeParams, Song, SongsNavigation, AlertService) {
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
                SongsNavigation.gotoSongsPage();
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

        $scope.song = new Song();
    } else {
        $scope.form_title = "Edit Song";
        $scope.form_submit_caption = "Save";
        $scope.formSubmitAction = saveAction;

        $scope.song = Song.get(
            { song_oid: $routeParams.song_oid },
            angular.noop,
            function (error) {
                alert.$resource_error("Failed to retrieve song detail.", error);
            }
        );
    }

    // Cancel
    $scope.cancelAction = function () {
        SongsNavigation.gotoSongsPage();
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
