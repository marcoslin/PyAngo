/**
 * Create Services to be used by controllers.
 */
angular.module("jsonServices", ['ngResource','ui.bootstrap'])
    .factory('Songs', function($resource){
        return $resource("/json/song/:song_oid", {}, {
            query: { method:'GET', isArray:true },
            get: { method:'GET' },
            save: { method: 'PUT' },
            add: { method:'POST' },
            remove: { method:'DELETE'}
        });
    })

/**
 * Create Services to be used by views.
 */
angular.module("guiServices", ['ngResource', "ui.bootstrap"])
    .factory("Confirm", function($dialog) {
        return function (title) {
            var message = "Proceed?";
            var buttons = [ { result:'ok', label:'Ok', cssClass:'btn-primary confirm-ok'}, { result:'cancel', label:'Cancel', cssClass:'confirm-cancel'} ];
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
        var showAlert = function ($scope) {
            this.scope = $scope;
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
            if ( resource_error['data'] ) {
                error_message = message + "  Server message: '" + resource_error['data'] + "'";
            } else {
                error_message = message + "  Make sure that server is running.";
            }
            this.$error(error_message);
        };
        showAlert.prototype.$success = function (message) {
            this.scope.alerts = [ { type: "success", msg: message} ];
        };
        return function($scope) {
            $scope.alerts = [];

            // Create Method to responde to Close Alert
            $scope.closeAlert = function () {
                $scope.alerts = [];
            };

            return new showAlert($scope)
        };
    });
