var app = angular.module('birchApp', ['ngRoute', 'ngResource']);

app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl: 'pages/start.html', 
		controller: 'startController'
	})

	.when("/bot/:uuid", {
		templateUrl: 'pages/botinfo.html',
		controller: 'botInfoController'
	})

	.when("/connect", {
		templateUrl: 'pages/connect.html',
		controller: 'connectController'
	});
});

app.factory('StatusService', function($resource) {
	return $resource('http://localhost:8080/status')
});

app.controller('startController', function($scope) {
	$scope.message = 'start';
});

app.controller('botInfoController', ['$scope', '$routeParams', 'StatusService', '$http', function($scope, $routeParams, StatusService, $http) {
	$scope.message = 'botinfo';
	$scope.uuid = $routeParams.uuid;
	$scope.bot = null;

	$scope.channel ="";
	$scope.password = "";
	
	load = function() { 
		StatusService.query(function(resources) {
			angular.forEach(resources, function(resource) {
				console.log(resource.uuid);
				console.log(resource.uuid == $scope.uuid);
				if(resource.uuid == $scope.uuid) {
					$scope.bot = resource;
					console.log(resource);
					return;
				}
			});
		});
	};
	
	load();
	
	$scope.join = function() {
		_url = "http://localhost:8080/join/"+$scope.bot.uuid+"/";
		_c = $scope.channel;
		_p = $scope.password != '' ? "/" + $scope.password : "";
		console.log(_url + _c + _p);
		$http.get(_url + _c + _p);
	}
}]);

app.controller('connectController', function($scope) {
	$scope.message = 'conect';
});

app.controller('sidebarController', ['$scope', '$http', 'StatusService', function($scope, $http, StatusService) {

	$scope.status = {};
	$scope.status.bots;

	$scope.status.load = function() {
		$scope.status.bots = StatusService.query();
	};

	$scope.status.load();
}]);

