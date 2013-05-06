/**
 * Configure Controllers
 */

/*global angular, pyango_app */

pyango_app.controller('SongListController', function ($scope, $routeParams, Songs, SongsNavigation, AlertService) {
    'use strict';
    // Define number of pages the paging control should show
    $scope.maxPagesBlocks = 15;

    /* --------------------
     * PRIVATE METHODS
     */
    // Handle Alert
    var alert = new AlertService($scope), updateSortImage, loadSongs;

    // Set the image to indicate which column is selected for sort
    updateSortImage = function(sortField) {
        // Set the sort picture from the header
        var fields = ["track_name", "artist", "album", "genre"];
        for (var i in fields) {
            var field = fields[i];
            var field_img = field + '_sort_img';

            if ( $scope.sort_by === undefined || $scope.sort_by !== field ) {
                // If no sort field set or if the field is not being sorted
                $scope[field_img] = "sort_both.png";
            } else {
                // Return appropriate image as per sort_asc flag
                if ($scope.sort_asc === 1) {
                    $scope[field_img] = "sort_asc.png";
                } else {
                    $scope[field_img] =  "sort_desc.png";
                }
            }
        }
    };

    // Populate Song List
    loadSongs = function () {
        // Set page to return
        var query_param = { page_num: $scope.page_num }

        // Only set the search term if set
        if ($scope.search_term) {
            query_param[$scope.search_by] = $scope.search_term;
        }

        if ($scope.sort_by) {
            query_param.sort_by = $scope.sort_by;
            query_param.sort_asc = $scope.sort_asc;
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

        // Add the search_by to the query params and add it to the SongsNavigation service
        query_param.search_by = $scope.search_by;
        SongsNavigation.setSongsPageStatus(query_param);
    };


    /* --------------------
     * SCOPE METHODS
     */
    // Watch for change in the page_num and reload the song list
    $scope.$watch('page_num', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            loadSongs();
        }
    });

    // Set the search turn and reload song list.  Not binding the input directly to search_term as
    // user need to submit the search form for search to kick off.
    $scope.searchFormSubmit = function () {
        // Set the search_term and reload the page.
        $scope.search_term = $scope.search_term_input;
        loadSongs();
    };

    // Call by table header to invoke sort
    $scope.setSortBy = function(sortField) {
        if ($scope.sort_by === undefined) {
            // If setting sort from no sort
            $scope.sort_by = sortField;
            $scope.sort_asc = 1;
        } else if ($scope.sort_by === sortField && $scope.sort_asc === 0) {
            // If clicking on a sort descending field, clear sort flags
            $scope.sort_by = undefined;
            $scope.sort_asc = undefined;
        } else if ($scope.sort_by === sortField) {
            // If clicking on a sort ascending field, set to sort descending
            $scope.sort_asc = 0;
        } else {
            // If asking to sort on another field
            $scope.sort_by = sortField;
            $scope.sort_asc = 1;
        }

        updateSortImage(sortField);

        // Refresh the page's data
        loadSongs();
    };

    /* --------------------
     * LOAD DATA
     */
    // Set the page state to saved status.
    if (SongsNavigation.isStatusSet()) {
        $scope.page_num = SongsNavigation.getSongsPageStatus('page_num');
        $scope.search_by = SongsNavigation.getSongsPageStatus('search_by');
        $scope.search_term = SongsNavigation.getSongsPageStatus($scope.search_by);
        $scope.sort_by = SongsNavigation.getSongsPageStatus('sort_by');
        $scope.sort_asc = SongsNavigation.getSongsPageStatus('sort_asc');
        // Update search input box if search_term is set
        if ( $scope.search_term ) {
            $scope.search_term_input = $scope.search_term
        }
        // Update image based on saved state
        updateSortImage($scope.sort_by);
    } else {
        $scope.search_by = "search";
        $scope.page_num = 1;
    }

    // LOAD THE PAGE DATA
    loadSongs();

});

pyango_app.controller('SongController', function ($scope, $route, $routeParams, Song, SongsNavigation, Confirm, AlertService) {
    'use strict';

    /* --------------------
     * PRIVATE METHODS
     */

    // Handle Alert
    var alert = new AlertService($scope), addAction, saveAction, removeAction;

    // Add song
    addAction = function () {
        $scope.song.$add(
            function () {
                alert.$success("New song '" + $scope.song.track_name + "' added.");
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

    // Delete client
    removeAction = function (song_oid, callback) {
        // callback will return a client_deleted flag, used for unit test
        var song_name = $scope.song.track_name;
        $scope.song.$remove(
            { song_oid: $scope.song._id.$oid },
            function () {
                alert.$success("'" + song_name + "' deleted ")
                if ( callback ) {
                    callback(true);
                }
            },
            function (error) {
                alert.$resource_error("Failed to delete '" + song_name + "'.", error);
                if ( callback ) {
                    callback(false);
                }
            }
        );
    };

    /* --------------------
     * SCOPE METHODS
     */

    // Ask to confirm the song deletion before deleting it
    $scope.askToRemoveSong = function (song_oid, song_name) {
        // Callback is used for unit testing to confirm that clients array has be updated correctly
        Confirm("About to delete '" + song_name + "'.")
            .open()
            .then( function (result) {
                if ( result == "ok" ){
                    removeAction(song_oid, function (songDeleted) {
                        if (songDeleted) {
                            // Go back to songs page if delete successful
                            SongsNavigation.gotoSongsPage();
                        }
                    });
                }
            });
    };

    // Cancel
    $scope.cancelAction = function () {
        SongsNavigation.gotoSongsPage();
    };


    /* --------------------
     * LOAD DATA
     */
    // Configure scope based on form mode
    if ($route.current.form_mode === 'add') {
        $scope.form_title = "Add a New Song";
        $scope.form_submit_caption = "Add";
        $scope.show_delete_button = "hide";
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
