/* jasmine specs for controllers go here */

/*globals describe, module, beforeEach */
/*jslint vars: true, */

describe('pyango.app', function () {
    'use strict';

    // Need to load module to be used.  By default, on ng module is loaded.
    beforeEach(module("pyango.app"));

    // Override the default Confirm service to return always true
    var confirm_text = "";
    beforeEach(
        module(function ($provide) {
            $provide.factory('Confirm', function () {
                var mock_then = {
                    then: function (callback) {
                        callback("ok");
                    }
                };
                var mock_open = {
                    open: function () {
                        return mock_then;
                    }
                };
                return function (title) {
                    confirm_text = title;
                    return mock_open;
                };
            });
        })
    );

    // Create a default list of song for testing
    var testSongs = {
        "total_pages": 6,
        "rows": [
            {"album": "Elis & Tom", "artist": "Antonio Carlos Jobim & Elis Regina", "track_num": 9, "track_name": "Brigas Nunca Mais", "genre": "Bossa Nova", "_id": {"$oid": "5188aadcbd243fef4fbed041"}},
            {"album": "Elis & Tom", "artist": "Antonio Carlos Jobim & Elis Regina", "track_num": 6, "track_name": "Corcovado", "genre": "Bossa Nova", "_id": {"$oid": "5188aadcbd243fef4fbed042"}},
            {"album": "Elis & Tom", "artist": "Antonio Carlos Jobim & Elis Regina", "track_num": 11, "track_name": "Fotografia", "genre": "Bossa Nova", "_id": {"$oid": "5188aadcbd243fef4fbed043"}},
            {"album": "Elis & Tom", "artist": "Antonio Carlos Jobim & Elis Regina", "track_num": 4, "track_name": "Modinha", "genre": "Bossa Nova", "_id": {"$oid": "5188aadcbd243fef4fbed044"}},
            {"album": "Elis & Tom", "artist": "Antonio Carlos Jobim & Elis Regina", "track_num": 7, "track_name": "O Que Tinha De Ser", "genre": "Bossa Nova", "_id": {"$oid": "5188aadcbd243fef4fbed045"}},
            {"album": "Elis & Tom", "artist": "Antonio Carlos Jobim & Elis Regina", "track_num": 2, "track_name": "Pois \u00c9", "genre": "Bossa Nova", "_id": {"$oid": "5188aadcbd243fef4fbed046"}},
            {"album": "Elis & Tom", "artist": "Antonio Carlos Jobim & Elis Regina", "track_num": 10, "track_name": "Por Toda A Minha Vida", "genre": "Bossa Nova", "_id": {"$oid": "5188aadcbd243fef4fbed047"}},
            {"album": "Elis & Tom", "artist": "Antonio Carlos Jobim & Elis Regina", "track_num": 8, "track_name": "Retrato Em Preto E Branco", "genre": "Bossa Nova", "_id": {"$oid": "5188aadcbd243fef4fbed048"}},
            {"album": "Elis & Tom", "artist": "Antonio Carlos Jobim & Elis Regina", "track_num": 12, "track_name": "Soneto De Separa\u00e7\u00e3o", "genre": "Bossa Nova", "_id": {"$oid": "5188aadcbd243fef4fbed049"}},
            {"album": "Elis & Tom", "artist": "Antonio Carlos Jobim & Elis Regina", "track_num": 3, "track_name": "S\u00f3 Tinha De Ser Com Voc\u00ea", "genre": "Bossa Nova", "_id": {"$oid": "5188aadcbd243fef4fbed04a"}},
            {"album": "Elis & Tom", "artist": "Antonio Carlos Jobim & Elis Regina", "track_num": 5, "track_name": "Triste", "genre": "Bossa Nova", "_id": {"$oid": "5188aadcbd243fef4fbed04b"}},
            {"album": "Elis & Tom", "artist": "Antonio Carlos Jobim & Elis Regina", "track_num": 1, "track_name": "\u00c1guas de Mar\u00e7o", "genre": "Bossa Nova", "_id": {"$oid": "5188aadcbd243fef4fbed04c"}},
            {"album": "Brit Awards 2003", "artist": "Blue", "track_num": 2, "track_name": "One Love", "genre": "Pop", "_id": {"$oid": "5188aadcbd243fef4fbed04d"}},
            {"album": "Brit Awards 2003", "artist": "Coldplay", "track_num": 3, "track_name": "In My Place", "genre": "Pop", "_id": {"$oid": "5188aadcbd243fef4fbed04e"}},
            {"album": "Brit Awards 2003", "artist": "Craig David", "track_num": 11, "track_name": "What's Your Flava?", "genre": "Pop", "_id": {"$oid": "5188aadcbd243fef4fbed04f"}}
        ]
    };

    // Function used to retrive song by id
    var get_song = function (song_oid) {
        for (var i = 0; i < testSongs.rows.length; i++) {
            var song = testSongs.rows[i];
            if ( song._id.$oid == song_oid ) {
                return song;
            };
        };
    };

    /**
	 * Testing the SongListController
	 */
	describe('SongListController', function(){
		var nav, scope, httpBackend;
		
		beforeEach(
            inject(function ($rootScope, $controller, $httpBackend, SongsNavigation) {
                scope = $rootScope.$new();
                httpBackend = $httpBackend;
                nav = SongsNavigation;
                httpBackend.resetExpectations();
                httpBackend.expectGET("/json/songs/1").respond(testSongs);
                var ctrl = $controller("SongListController", { $scope: scope });
                httpBackend.flush();
            })
		);
		
		it('songs should be initialized with full population.', function() {
			expect(scope.songs.length).toBe(testSongs.rows.length);
		});


        describe('SEARCH', function () {
            it('default word search', function () {
                // Simulate entry in the text box
                var search_term = "the best song";
                httpBackend.expectGET("/json/songs/1?search=the+best+song").respond(testSongs);
                scope.search_term_input = search_term;
                scope.searchFormSubmit();
                httpBackend.flush();

                expect(scope.search_term).toBe(search_term);
                var search_by = nav.getSongsPageStatus("search_by");
                expect(nav.getSongsPageStatus(search_by)).toBe(search_term);
            });
            it('by album on page 3', function () {
                // Simulate entry in the text box
                var search_term = "only the best";
                httpBackend.expectGET("/json/songs/3?album=only+the+best").respond(testSongs);
                scope.page_num = 3;
                scope.search_term_input = search_term;
                scope.search_by = "album";
                scope.searchFormSubmit();

                expect(scope.search_term).toBe(search_term);
                var search_by = nav.getSongsPageStatus("search_by");
                expect(nav.getSongsPageStatus(search_by)).toBe(search_term);
                expect(nav.getSongsPageStatus('page_num')).toBe(3);
            });

        });

        describe('SORT', function () {
            it('setting sort order for artist', function () {
                var no_sort = "sort_both.png",
                    sort_asc = "sort_asc.png",
                    sort_desc = "sort_desc.png";

                // First call should make artist sort ascending
                httpBackend.expectGET("/json/songs/1?sort_asc=1&sort_by=artist").respond(testSongs);
                scope.setSortBy('artist');
                httpBackend.flush();
                expect(scope.sort_by).toBe('artist');
                expect(scope.sort_asc).toBe(1);
                expect(nav.getSongsPageStatus("sort_by")).toBe('artist');
                expect(nav.getSongsPageStatus("sort_asc")).toBe(1);
                expect(scope.track_name_sort_img).toBe(no_sort);
                expect(scope.artist_sort_img).toBe(sort_asc);
                expect(scope.album_sort_img).toBe(no_sort);
                expect(scope.genre_sort_img).toBe(no_sort);

                // Second call should make artist sort descending
                httpBackend.expectGET("/json/songs/1?sort_asc=0&sort_by=artist").respond(testSongs);
                scope.setSortBy('artist');
                httpBackend.flush();
                expect(scope.sort_by).toBe('artist');
                expect(scope.sort_asc).toBe(0);
                expect(nav.getSongsPageStatus("sort_by")).toBe('artist');
                expect(nav.getSongsPageStatus("sort_asc")).toBe(0);
                expect(scope.track_name_sort_img).toBe(no_sort);
                expect(scope.artist_sort_img).toBe(sort_desc);
                expect(scope.album_sort_img).toBe(no_sort);
                expect(scope.genre_sort_img).toBe(no_sort);

                // Third call should make clear sort
                httpBackend.expectGET("/json/songs/1").respond(testSongs);
                scope.setSortBy('artist');
                httpBackend.flush();
                expect(nav.getSongsPageStatus("sort_by")).toBe(undefined);
                expect(nav.getSongsPageStatus("sort_asc")).toBe(undefined);
                expect(scope.sort_by).toBe(undefined);
                expect(scope.sort_asc).toBe(undefined);
                expect(scope.track_name_sort_img).toBe(no_sort);
                expect(scope.artist_sort_img).toBe(no_sort);
                expect(scope.album_sort_img).toBe(no_sort);
                expect(scope.genre_sort_img).toBe(no_sort);
            });
            it('altering sort column', function () {
                var no_sort = "sort_both.png",
                    sort_asc = "sort_asc.png",
                    sort_desc = "sort_desc.png";

                // First call should make album sort ascending
                httpBackend.expectGET("/json/songs/1?sort_asc=1&sort_by=album").respond(testSongs);
                scope.setSortBy('album');
                httpBackend.flush();
                expect(scope.sort_by).toBe('album');
                expect(scope.sort_asc).toBe(1);
                expect(scope.track_name_sort_img).toBe(no_sort);
                expect(scope.artist_sort_img).toBe(no_sort);
                expect(scope.album_sort_img).toBe(sort_asc);
                expect(scope.genre_sort_img).toBe(no_sort);

                // Second call to another field should set that field to sort ascending
                httpBackend.expectGET("/json/songs/1?sort_asc=1&sort_by=track_name").respond(testSongs);
                scope.setSortBy('track_name');
                httpBackend.flush();
                expect(scope.sort_by).toBe('track_name');
                expect(scope.sort_asc).toBe(1);
                expect(scope.track_name_sort_img).toBe(sort_asc);
                expect(scope.artist_sort_img).toBe(no_sort);
                expect(scope.album_sort_img).toBe(no_sort);
                expect(scope.genre_sort_img).toBe(no_sort);

                // Back to the first column should sort ascending
                httpBackend.expectGET("/json/songs/1?sort_asc=1&sort_by=album").respond(testSongs);
                scope.setSortBy('album');
                httpBackend.flush();
                expect(scope.sort_by).toBe('album');
                expect(scope.sort_asc).toBe(1);
                expect(scope.track_name_sort_img).toBe(no_sort);
                expect(scope.artist_sort_img).toBe(no_sort);
                expect(scope.album_sort_img).toBe(sort_asc);
                expect(scope.genre_sort_img).toBe(no_sort);

                // Make sure sort can be cleared with 2 more clicks
                httpBackend.expectGET("/json/songs/1?sort_asc=0&sort_by=album").respond(testSongs);
                scope.setSortBy('album');
                httpBackend.expectGET("/json/songs/1").respond(testSongs);
                scope.setSortBy('album');
                httpBackend.flush();
                expect(scope.sort_by).toBe(undefined);
                expect(scope.sort_asc).toBe(undefined);
                expect(scope.track_name_sort_img).toBe(no_sort);
                expect(scope.artist_sort_img).toBe(no_sort);
                expect(scope.album_sort_img).toBe(no_sort);
                expect(scope.genre_sort_img).toBe(no_sort);

            });
        });


	});
	
	/**
	 * Testing the SongController
	 */
	describe('SongController', function () {
		var scope, httpBackend;
        beforeEach(
            inject(function ($rootScope, $httpBackend) {
                scope = $rootScope.$new();
                httpBackend = $httpBackend;
            })
        );

        describe('EDIT', function () {
            var song, song_oid;
            beforeEach(
                inject(function ($controller) {
                    var current = { form_mode: "edit" };

                    song_oid = "5188aadcbd243fef4fbed041";
                    song = get_song(song_oid);

                    httpBackend.whenGET("/json/song/" + song_oid).respond(song);
                    var ctrl = $controller("SongController", { $scope: scope, $routeParams : { song_oid: song_oid }, $route: { current: current } });
                    httpBackend.flush();
                })
            );

            it("check the song name is correct.", function () {
                expect(scope.song.track_name).toBe(song.track_name);
                expect(scope.song.artist).toBe(song.artist);
                expect(scope.song.album).toBe(song.album);
            });

            it("updating a song should be done via PUT with song_oid", function () {
                httpBackend.expectPUT("/json/song/" + song_oid).respond();
                scope.song.album = "New Album";
                scope.formSubmitAction();
                httpBackend.flush();

                var alert = scope.alerts[0];
                expect(alert.msg).toMatch(/Brigas Nunca Mais.+updated\.$/);

            });

        });

        describe('ADD', function () {
            beforeEach(
                inject(function ($rootScope, $controller, $httpBackend) {
                    var current = { form_mode: "add" };
                    var ctrl = $controller("SongController", { $scope: scope, $route: { current: current } });
                })
            );

            it("adding a song should be done via POST", function () {
                httpBackend.expectPOST("/json/song").respond();
                scope.song.track_name = "New Song 1XYUYT";
                scope.song.artist = "Karma Unit Test";
                scope.formSubmitAction();
                httpBackend.flush();

                var alert = scope.alerts[0];
                expect(alert.msg).toMatch(/New Song 1XYUYT.+added\.$/);
            });
        });
		
	});

    /**
     * Testing the TypeAhead Controllers
     */
    describe('TypeAheadControllers', function () {
        var list_2_entries = [{"name": "entry 1"}, {"name": "entry 2"}],
            list_4_entries = [{"name": "a"}, {"name": "b"}, {"name": "c"}, {"name": "d"}],
            scope, controller, httpBackend;

        beforeEach(
            inject(function ($rootScope, $httpBackend, $controller) {
                scope = $rootScope.$new();
                httpBackend = $httpBackend;
                controller = $controller;
            })
        );

        it('getting list of artist', function () {
            httpBackend.whenGET('/json/ref/artist').respond(list_2_entries);
            var ctrl = controller("TypeAheadArtistController", { $scope: scope });
            httpBackend.flush();
            expect(scope.artists.length).toBe(2);
        });

        it('getting list of album', function () {
            httpBackend.whenGET('/json/ref/album').respond(list_4_entries);
            var ctrl = controller("TypeAheadAlbumController", { $scope: scope });
            httpBackend.flush();
            expect(scope.albums.length).toBe(4);
        });

        it('getting list of genre', function () {
            httpBackend.whenGET('/json/ref/genre').respond(list_2_entries);
            var ctrl = controller("TypeAheadGenreController", { $scope: scope });
            httpBackend.flush();
            expect(scope.genres.length).toBe(2);
        });
    });

});
