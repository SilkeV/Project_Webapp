var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function($rootScope) {
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
});

app.config(function($routeProvider) {
    $routeProvider
    //the timeline display
        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })
        //the login display
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'authController'
        })
        //the signup display
        .when('/register', {
            templateUrl: 'register.html',
            controller: 'authController'
        });
});

app.factory('postService', function($resource) {
    return $resource('/api/posts/:id');
});

app.controller('mainController', function(postService, $scope, $rootScope, $http) {
    $scope.posts = postService.query();
    $scope.newPost = {
        created_by: '',
        text: '',
        created_at: ''
    };

    $scope.post = function() {
        $scope.newPost.created_by = $rootScope.current_user;
        $scope.newPost.created_at = Date.now();
        postService.save($scope.newPost, function() {
            $scope.posts = postService.query();
            $scope.newPost = {
                created_by: '',
                text: '',
                created_at: ''
            };
        });
    };

		$scope.deletePost = function(id) {
			$http.delete('/api/posts/' + id).then(function() {
				location.reload();
			})
		}

		$scope.sameUser = function(user) {
			if(user == $rootScope.current_user) {
				return true;
			}
			else {
				return false;
			}
		}
});

angular
    .module('chirpApp')
    .directive('directiveExtra', directiveExtraDirective);

function directiveExtraDirective() {
    return {
        templateUrl: '../directiveExtra.html',
        controller: 'mainController',
        controllerAs: '$scope'
    }
};

app.controller('authController', function($scope, $http, $rootScope, $location) {
    $scope.user = {
        username: '',
        password: ''
    };
    $scope.error_message = '';

    $scope.login = function() {
        $http.post('/auth/login', $scope.user).success(function(data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path('/');
            } else {
                $scope.error_message = data.message;
            }
        });
    };

    $scope.signout = function() {
        $http.get('auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = '';
        location.reload();
    };

    $scope.register = function() {
        $http.post('/auth/signup', $scope.user).success(function(data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path('/');
            } else {
                $scope.error_message = data.message;
            }
        });
    };
});
