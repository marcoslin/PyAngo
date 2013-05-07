/* jasmine specs for controllers go here */

/*globals describe beforeEach*/

describe('pyango.app', function () {
    'use strict';

    // Need to load module to be used.  By default, on ng module is loaded.
    beforeEach(module("pyango.app"));

    // Override the default Confirm service to return always true
    var confirm_text = "";
    beforeEach(
        module( function ($provide) {
            $provide.factory('Confirm', function () {
                var mock_then = {
                    then: function (callback) {
                        callback("ok")
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
	 *
	 * Testing the songListController
	 *
	 */
	describe('SongListController', function(){
		var scope;
		
		beforeEach(
			inject(function ($rootScope, $controller, $httpBackend) {
				scope = $rootScope.$new();
				$httpBackend.whenGET('/json/songs/1').respond(testSongs);
				var ctrl = $controller("SongListController", { $scope: scope });
				$httpBackend.flush();
				// Clear the Confirm Service Text
				confirm_text = ""
			})
		);
		
		it('songs should be initialized with full population.', function() {
			expect(scope.songs.length).toBe(testSongs.rows.length);
		});
		
	});
	
	/**
	 * Testing the songController
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

});
