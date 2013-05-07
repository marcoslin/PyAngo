/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

/*globals*/
/*jslint vars: true, */

describe('pyango.app', function () {
    'use strict';

    describe('List View', function () {
        beforeEach(function () {
            browser().navigateTo('/app/#/songs/');
        });

        it('initial population should be 10 and check the first song', function () {
            //expect(repeater('.song_track_name').count()).toBe(15);
            expect(repeater('.song_oid').count()).toBe(15);
            // First song name in the list expect to be "Brigas Nunca Mais"
            expect(element(".song_track_name:eq(0)").text()).toBe("Brigas Nunca Mais");
            // Expect 6 pages, 2 next/prev and 2 first/last
            expect(repeater("#song_list_paging li").count()).toBe(10);
        });

        it('going to page 3 should work', function () {
            expect(element("#song_list_paging div ul li a:eq(4)").text()).toBe("3");
            element("#song_list_paging div ul li a:eq(4)").click();
            expect(element(".song_track_name:eq(0)").text()).toBe("Little By Little");
        });

        it('search by "All" for "one" should return 7', function () {
            input('search_term_input').enter('one');
            element('#search_form #submit').click();
            expect(repeater('.song_track_name').count()).toBe(7);
        });

        it('search by "Artist" for "one" should return 1', function () {
            input('search_term_input').enter('one');
            select('search_by').option('artist');
            element('#search_form #submit').click();
            expect(repeater('.song_track_name').count()).toBe(1);
        });

        it('order by Name should change the order of the songs', function () {
            // First click should sort ascending
            element('#song_track_name_header').click();
            expect(element(".song_track_name:eq(0)").text()).toBe("4 My People");
            // Second click should sort descending
            element('#song_track_name_header').click();
            expect(element(".song_track_name:eq(0)").text()).toBe("Águas de Março");
            // Third click should rest the search
            element('#song_track_name_header').click();
            expect(element(".song_track_name:eq(0)").text()).toBe("Brigas Nunca Mais");
        });

        it('clicking a song name should take user to edit page', function () {
            // 3rd item should be 'Fotografia'
            element(".song_track_name:eq(2)").click();
            expect(browser().location().url()).toMatch(/song\/\w+/);
            expect(element("#form_title").text()).toBe("Edit Song");
            expect(input("song.track_name").val()).toBe("Fotografia");
            // Delete button should be present
            expect(repeater('#delete_song.hide').count()).toBe(0);
            // Make sure cancel works
            element("#cancel_detailForm").click();
            expect(browser().location().url()).toBe("/songs/");
        });

        it('clicking Add button should take user to add page', function () {
            element("#add_song").click();
            expect(browser().location().url()).toBe("/song/add");
            expect(element("#form_title").text()).toBe("Add a New Song");
            // Delete button should be hidden
            expect(repeater('#delete_song.hide').count()).toBe(1);
            // Make sure cancel works
            element("#cancel_detailForm").click();
            expect(browser().location().url()).toBe("/songs/");
        });

        // Make sure page state is saved
        it('should be able to return to previous page state', function () {
            // Set page status to search by album for brit should result the first song
            // to be 'Unchained Melody'
            var search_term = 'brit',
                search_by = 'album',
                sort_by = '#song_artist_header',
                page_num_item = 3, page_num = "2",
                result_first_song = "Unchained Melody"

            // Set page status and check first song name
            input('search_term_input').enter(search_term);
            select('search_by').option(search_by);
            element('#search_form #submit').click();
            element(sort_by).click();
            element("#song_list_paging div ul li a:eq(" + page_num_item + ")").click();
            expect(element(".song_track_name:eq(0)").text()).toBe(result_first_song);

            // Go to the add page and cancel
            element("#add_song").click();
            expect(browser().location().url()).toBe("/song/add");
            expect(element("#form_title").text()).toBe("Add a New Song");
            element("#cancel_detailForm").click();

            // Songs page should still be set to search to Brit, sort by Artist, go to page 2
            expect(browser().location().url()).toBe("/songs/");
            expect(element(".song_track_name:eq(0)").text()).toBe(result_first_song);
            expect(input('search_term_input').val()).toBe(search_term);
            expect(element('#search_by').val()).toBe(search_by);
            expect(element(sort_by + ' + img').attr('src')).toMatch(/sort_asc/);
            expect(element("#song_list_paging .active a").text()).toBe(page_num);

            // Go to edit and cancel
            element(".song_track_name:eq(0)").click();
            expect(browser().location().url()).toMatch(/song\/\w+/);
            expect(element("#form_title").text()).toBe("Edit Song");
            element("#cancel_detailForm").click();

            // Songs page should still be set to search to Brit, sort by Artist, go to page 2
            expect(browser().location().url()).toBe("/songs/");
            expect(element(".song_track_name:eq(0)").text()).toBe(result_first_song);
            expect(input('search_term_input').val()).toBe(search_term);
            expect(element('#search_by').val()).toBe(search_by);
            expect(element(sort_by + ' + img').attr('src')).toMatch(/sort_asc/);
            expect(element("#song_list_paging .active a").text()).toBe(page_num);
        });

    });

    describe('Edit View', function () {
        var song_oid = "5188dc1abd243fef4fbed627",
            song_track_name = "Nu Flow",
            song_artist = "Big Brovaz";

        beforeEach(function () {
            // Edit "Nu Flow" by "Big Brovaz" in album "Brit Awards 2003"
            browser().navigateTo('/app/#/song/' + song_oid);
        });

        it('checking client name loaded', function () {
            expect(element("#song_oid").text()).toBe(song_oid);
            expect(input("song.track_name").val()).toBe(song_track_name);
            expect(input("song.artist").val()).toBe(song_artist);
        });

        it('should not save without required field', function () {
            input("song.track_name").enter("");
            element("#submit_detailForm").click();
            expect(repeater(".alert").count()).toBe(0);
            expect(browser().location().url()).toBe("/song/" + song_oid);
        });

        it('successful save should redirect to list view', function () {
            input("song.track_name").enter("New Song Title 123kjsDUDF");
            element("#submit_detailForm").click();
            expect(browser().location().url()).toBe("/songs/");
        });

        it('revert song track_name to expected value', function () {
            input("song.track_name").enter(song_track_name);
            element("#submit_detailForm").click();
            expect(browser().location().url()).toBe("/songs/");
        });
    });

    var added_song_title = "A Brand New Song Title Xsdfw2GC";
    describe('Add View', function () {

        beforeEach(function() {
            browser().navigateTo('/app/#/song/add');
        });

        it('should not submit without track_name.', function () {
            input("song.track_name").enter("");
            element("#submit_detailForm").click();
            expect(repeater(".alert").count()).toBe(0);
            expect(browser().location().url()).toBe("/song/add");
        });

        it('successful submit should show alert', function () {
            input("song.track_name").enter(added_song_title);
            element("#submit_detailForm").click();
            element("#submit_detailForm").click();

            // Make sure that alert services display a success message
            expect(repeater("#alert_section .alert").count()).toBe(1);
            expect(element("#alert_section .alert div span:first-of-type").text()).toMatch(added_song_title);
            // Make sure taht alert can be closed
            element('#alert_section .alert .close').click();
            expect(repeater("#alert_section .alert").count()).toBe(0);
        });
    });

    describe('Delete Song', function() {
        beforeEach(function() {
            browser().navigateTo('/app/#/songs/');
        });

        it('clicking a song name should take user to edit page', function () {
            input('search_term_input').enter(added_song_title);
            element('#search_form #submit').click();
            expect(element(".song_track_name:eq(0)").text()).toBe(added_song_title);
            element(".song_track_name:eq(0)").click();

            // Make sure we are at the right edit page
            expect(browser().location().url()).toMatch(/song\/\w+/);
            expect(element("#form_title").text()).toBe("Edit Song");
            expect(input("song.track_name").val()).toBe(added_song_title);

            // Click on Delete
            element("#delete_song").click();

            // Make sure Confirm display the songs' name and click on "Ok"
            expect(element(".modal-header h1").text()).toMatch(added_song_title);
            element(".modal-footer .confirm-ok").click();

            // Delete should now take you back to songs page
            expect(browser().location().url()).toBe("/songs/");
        });

    });

});
