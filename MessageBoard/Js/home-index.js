// home-index.js
var module = angular.module("homeIndex", ['ngRoute']);//.controller("topicsController", function topicsController($scope, $http) {

// Routing
module.config(function ($routeProvider) {
    $routeProvider.when("/", {
        controller: "TopicsController",
        templateUrl: "/Templates/TopicsView.html"
    });

    $routeProvider.when("/newmessage", {
        controller: "NewTopicController",
        templateUrl: "/Templates/NewTopicView.html"
    })

    $routeProvider.when("/message/:id", {
        controller: "SingleTopicController",
        templateUrl: "/Templates/SingleTopicView.html"
    });

    $routeProvider.otherwise({ redirectTo: "/" });
});

// Services
module.factory("dataService", function ($http, $q) {
    var _topics = [];
    var _isInit = false;

    var _isReady = function () {
        return _isInit;
    }

    var _getTopics = function () {

        var deferred = $q.defer();

        $http.get("/api/v1/topics?includeReplies=true")
            .then(function (result) {
                // Successful
                angular.copy(result.data, _topics);
                _isInit = true;
                deferred.resolve();
            },
        function () {
            // Error
            deferred.reject();
        });

        return deferred.promise;
    };

    var _addTopic = function (newTopic) {
        var deferred = $q.defer();

        $http.post("api/v1/topics", newTopic)
            .then(function (result) {
                // Success
                var newlyCreatedTopic = result.data;
                _topics.splice(0, 0, newlyCreatedTopic);
                deferred.resolve(newlyCreatedTopic);
            },
            function () {
                // Error
                deferred.reject();
            })

        return deferred.promise;
    };

    function _findTopic(id) {
        var found = null;

        $.each(_topics, function (i, item) {
            if (item.id == id) {
                found = item;
                return false;
            }
        });

        return found;
    }

    var _getTopicById = function (id) {
        var deferred = $q.defer();

        if (_isReady()) {
            var topic = _findTopic(id);
            if (topic) {
                deferred.resolve(topic);
            }
            else {
                deferred.reject();
            }
        }
        else {
            _getTopics()
                .then(function () {
                    // Success
                    var topic = _findTopic(id);
                    if (topic) {
                        deferred.resolve(topic);
                    }
                    else {
                        deferred.reject();
                    }
                },
                function () {
                    // Error
                    deferred.reject();
                });
        }

        return deferred.promise;
    };
    
    var _saveReply = function (topic, newReply) {
        var deferred = $q.defer();

        $http.post("/api/v1/topics/" + topic.id + "/replies", newReply)
            .then(function (result) {
                // Success
                if (!topic.replies)
                    topic.replies = [];
                topic.replies.push(result.data);
                deferred.resolve(result.data);
            },
            function () {
                // Error
                deferred.reject();
            });

        return deferred.promise;
    }

    return {
        topics: _topics,
        getTopics: _getTopics,
        addTopic: _addTopic,
        isReady: _isReady,
        getTopicById: _getTopicById,
        saveReply: _saveReply
    };
});

// Controllers
// TopicsController - Home page showing all Messages
module.controller("TopicsController", function ($scope, dataService) {

    $scope.data = dataService;
    $scope.isBusy = false;

    if (dataService.isReady() == false) {
        $scope.isBusy = true;
        dataService.getTopics()
            .then(function () {
                // Success
            },
            function () {
                // Error
                alert("Could not load topics");
            })
            .then(function () {
                $scope.isBusy = false;
            });
    }
});

// NewTopicController - Creating a new message
module.controller("NewTopicController", function ($scope, $http, $window, dataService) {
    $scope.newTopic = {};

    $scope.save = function () {
        dataService.addTopic($scope.newTopic)
        .then(function () {
            // Success
            $window.location = "#/";
        },
        function () {
            // Error
            alert("Could not save the new topic");
        })
    };
});

// SingleTopicController - Drill down into a single Message to see the replies, as well as reply to the message
module.controller("SingleTopicController", function ($scope, dataService, $window, $routeParams) {
    $scope.topic = null;
    $scope.newReply = {};

    dataService.getTopicById($routeParams.id)
        .then(function (topic) {
            // Success  
            $scope.topic = topic;
        },
        function () {
            // Error
            $window.location = "#/";
        });

    $scope.addReply = function () {
        dataService.saveReply($scope.topic, $scope.newReply)
            .then(function () {
                // Success
                $scope.newReply.body = "";
            },
            function () {
                // Error
                alert("Could not save the new reply");
            });
    };
});