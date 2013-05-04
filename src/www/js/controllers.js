/**
 * Configure Controllers
 */
client_app.controller('SongListController', function ($scope, Songs, AlertService) {
    // Handle Alert
    var alert = AlertService($scope);
    // Read the list of client from url
    $scope.songs = Songs.query(
        function () {
            alert.$success( $scope.songs.length + " songs loaded.");
        },
        function (error) {
            alert.$resource_error("Failed to load song list.", error);
        }
    );
});

client_app.controller('SongController', function ($scope, $route, $routeParams, $location, Songs, AlertService) {
    // Handle Alert
    var alert = AlertService($scope);

    var addAction = function () {};
    var saveAction = function () {};

    // Configure scope based on form mode
    if ( $route.current.form_mode == 'add' ) {
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
