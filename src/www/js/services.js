/**
 * Create Services to be used by controllers.
 */

/*global angular */

angular.module("jsonServices", ['ngResource', 'ui.bootstrap'])
    .factory('Songs', function ($resource) {
        'use strict';
        return $resource("/json/songs/:page_num/:page_size", { page_num: 1, page_size: 15 }, {
            get: { method: 'GET' }
        });
    })
    .factory('Song', function ($resource) {
        'use strict';
        return $resource("/json/song/:song_oid", {}, {
            get: { method: 'GET' },
            save: { method: 'PUT' },
            add: { method: 'POST' },
            remove: { method: 'DELETE'}
        });
    })
    .factory("ReferenceData", function ($resource) {
        'use strict';
        return $resource("/json/ref/:ref_data", {}, {
            query: { method: 'GET', isArray: true }
        });
    })
    .factory("SongsNavigation", function ($location) {
        var self = this, page_num;

        return {
            setSongsPageNumber: function (page_num) {
                self.page_num = page_num;
            },
            navigateToSongsPage: function () {
                $location.path( "/songs/" + self.page_num );
            }
        };

    });

/**
 * Create Services to be used by views.
 */
angular.module("guiServices", ['ngResource', "ui.bootstrap"])
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
