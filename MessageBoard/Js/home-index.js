// home-index.js
var module = angular.module("homeIndex", ['ngRoute']);//.controller("topicsController", function topicsController($scope, $http) {

module.config(function ($routeProvider) {
    $routeProvider.when("/", {
        controller: "TopicsController",
        templateUrl: "/Templates/TopicsView.html"
    });

    $routeProvider.when("/newmessage", {
        controller: "newTopicController",
        templateUrl: "/Templates/NewTopicView.html"
    })

    $routeProvider.otherwise({ redirectTo: "/" });
});


module.controller("TopicsController", function ($scope, $http) {

    $scope.data = [];
    $scope.isBusy = true;

    $http.get("/api/v1/topics?includeReplies=true")
        .then(function (result) {
            // Successful
            angular.copy(result.data, $scope.data);
        },
        function () {
            // Error
            alert("Could not load topics");
        })
        .then(function () {
            $scope.isBusy = false;
        });
});

module.controller("NewTopicController", function ($scope, $http, $window) {

});