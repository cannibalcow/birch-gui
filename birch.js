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
	})

	.otherwise({
		redirectTo: '/'
	});


});

app.factory('StatusService', function($resource) {
	return $resource(birchcfg.birchUrl + 'status')
});

app.controller('startController', function($scope) {
	$scope.message = 'start';
});

app.controller('botInfoController', ['$scope', '$routeParams', 'StatusService', '$http', '$location', function($scope, $routeParams, StatusService, $http, $location) {
	$scope.message = 'botinfo';
	$scope.uuid = $routeParams.uuid;
	$scope.bot = null;

	$scope.channel = "";
	$scope.password = "";
	
	load = function() { 
		StatusService.query(function(resources) {
			angular.forEach(resources, function(resource) {
				if(resource.uuid == $scope.uuid) {
					$scope.bot = resource;
					return;
				}
			});
		});
	};
	
	load();
	
	$scope.join = function() {
		url = birchcfg.birchUrl + "join/"+$scope.bot.uuid+"/";
		channel = $scope.channel;
		password = $scope.password != '' ? "/" + $scope.password : "";
		$http.get(url + channel + password);
	};

	$scope.disconnect = function() {
		url = birchcfg.birchUrl + "disconnect/" + $scope.bot.uuid;
		$http.get(url);
		alert("bot disconnect");
		$location.path("/");	
	}
}]);

app.controller('connectController', ['$scope', '$location', '$http', '$route', function($scope, $location, $http, $route) {
	$scope.server = "";
	$scope.port = 6669;
	$scope.nick = "";
	$scope.message = "";

	$scope.submit = function() {
		$http.get(birchcfg.birchUrl + "connect/" + $scope.nick + "/" + $scope.server)
		.success(function(data, status, headers, config) {
			$route.reload();
			$location.path("/");
		})
		.error(function(data, status, headers, config) {
			$scope.message = "nope";
		});
	};
}]);

app.controller('sidebarController', ['$scope', '$http', 'StatusService', function($scope, $http, StatusService) {

	$scope.status = {};
	$scope.status.bots;

	$scope.status.load = function() {
		$scope.status.bots = StatusService.query();
	};

	$scope.status.load();

}]);

