// home-index.js
angular.module("myApp", []).controller("HomeIndexController", function HomeIndexController ($scope, $http) {
    $scope.dataCount = 0;
    $scope.data = [];

    $http.get("/api/v1/topics?includeReplies=true")
        .then(
        function (result) {
            // Successful
            angular.copy(result.data, $scope.data);
        },
        function () {
            // Error
            alert("Could not load topics");
        });
});