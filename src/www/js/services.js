/**
 * Create Services to be used by controllers.
 */

/*global angular */

angular.module("jsonServices", ['ngResource'])
    .factory('Songs', function ($resource) {
        // Retrieve the list of song.  Only page_num set the page to return.
        // Other params accepted: search_by, search_term, sort_by, sort_asc
        'use strict';
        return $resource("/json/songs/:page_num", { page_num: 1 }, {
            get: { method: 'GET' }
        });
    })
    .factory('Song', function ($resource) {
        // Retrieve a song
        'use strict';
        return $resource("/json/song/:song_oid", {}, {
            get: { method: 'GET' },
            save: { method: 'PUT' },
            add: { method: 'POST' },
            remove: { method: 'DELETE'}
        });
    })
    .factory("ReferenceData", function ($resource) {
        // Retrieve distinct list of artist, album or genre to be used by TypeAhead
        'use strict';
        return $resource("/json/ref/:ref_data", {}, {
            query: { method: 'GET', isArray: true }
        });
    })
    .factory("SongsNavigation", function ($location) {
        /**
         * This service is used to store the search, sort and page
         * criteria of the Songs List page allowing the app to
         * return the page to the stored location.
         */
        'use strict';
        var self = this, page_status, Nav;
        Nav = function () {
            this.setSongsPageStatus = function (page_status) {
                self.page_status = page_status;
                return this;
            };
            this.getSongsPageStatus = function (status) {
                //console.log("PageStatus " + status + ": " + self.page_status[status]);
                return self.page_status[status];
            };
            this.isStatusSet = function () {
                return (self.page_status !== undefined);
            };
            this.gotoSongsPage = function () {
                $location.path("/songs/");
                return this;
            };
        };

        return new Nav();
    });

/**
 * Create Services to be used by views.
 */
angular.module("guiServices", ["ui.bootstrap"])
    .factory("Confirm", function ($dialog) {
        'use strict';
        return function (title) {
            var message = "Proceed?",
                buttons = [ { result: 'ok', label: 'Ok', cssClass: 'btn-primary confirm-ok'}, { result: 'cancel', label: 'Cancel', cssClass: 'confirm-cancel'} ];
            return $dialog.messageBox(title, message, buttons);
        };
    })
    .factory("AlertService", function () {
        /**
         * Wrapper for show alert.  Ideally, it should work as:
         *   Alert.$error("...");
         *
         * But as there is no easy way to inject current $scope into service,
         * it would have to be implemented as:
         *     Alert($scope).$error("...");
         *
         * The final implementation is cleaner:
         *     var alert = AlertService($scope);
         *     alert.$error("...");
         */
        'use strict';
        var showAlert = function (scope) {
            scope.alerts = [];

            scope.closeAlert = function () {
                scope.alerts = [];
            };

            this.scope = scope;
        };
        showAlert.prototype.$error = function (message) {
            this.scope.alerts = [ { type: "error", msg: message } ];
        };
        showAlert.prototype.$resource_error = function (message, resource_error) {
            /**
             * Handle RESTful server error returned by $resource.  If server is not running the error returned by $resource is:
             *   error = { status: 0, data: ""};
             */
            var error_message = "";
            if (resource_error.data) {
                error_message = message + "  Server message: '" + resource_error.data + "'";
            } else {
                error_message = message + "  Make sure that server is running.";
            }
            this.$error(error_message);
        };
        showAlert.prototype.$success = function (message) {
            this.scope.alerts = [ { type: "success", msg: message} ];
        };
        return showAlert;
    });
