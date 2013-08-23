define([
	"angular",
	"angularui",
	"angularuirouter",
	"angularbs",
	"app/paginator",
	"app/util"
], function () {
	angular
	.module("timer", [
		"timer.util",
		"timer.paginator",
		"ui",
		"ui.router",
		"ui.bootstrap"
	])
	.config(function ($stateProvider) {
		$stateProvider
		.state("index", {
			url: "/index",
			templateUrl: "views/index.html"
		})
		.state("settings", {
			url: "/settings",
			templateUrl: "views/settings.html"
		})
		.state("games", {
			abstract: true,
			url: "/games",
			templateUrl: "views/games.html",
			controller: "Games"
		})
		.state("games.state", {
			url: "/{state:all|active|finished|dropped|hold|wish}?offset&limit"
		})
		.state("game", {
			url: "/games/{gameID}",
			templateUrl: "views/game.html",
			controller: "Game"
		});
	})
	.run(function ($rootScope, $state, Games, Game, Paginator) {
		$rootScope.$state = $state;
		$rootScope.Games = Games;
		$rootScope.Game = Game;
		$rootScope.$watch(Games.watcher, Games.watcherCallback);
	})
	.factory("Games", function (Game, Util, $state) {
		var data = JSON.parse(localStorage.getItem("gamesLog")) || [];
		var Games = {};
		return angular.extend(Games, {
			data: data,
			getByID: function (ID) {
				return this.data.filter(function (game) {
					return game.id === ID;
				})[0];
			},
			add: function (config) {
				data.push(Game.create(config));
			},
			remove: function (game) {
				game.isRemoved = true;
				data.splice(data.indexOf(game), 1);
			},
			save: function () {
				localStorage.setItem("gamesLog", angular.toJson(data));
			},
			showState: "active",
			watcher: function () {
				return angular.toJson(data);
			},
			watcherCallback: (function (current, old) {
				if (!angular.equals(current, old)) this.save();
			}).bind(Games),
			exportData: function () {
				window.open("data:text/plain;base64,"+Util.toB64(angular.toJson(data, true)));
			},
			importData: (function (data) {
				this.cleanData();
				[].push.apply(this.data, JSON.parse(data));
			}).bind(Games),
			cleanData: (function (data) {
				this.data.splice(0, this.data.length);
			}).bind(Games),
			pages: {
				offset: $state.params.offset || 0,
				limit: $state.params.limit || 25,
				limits: [25, 50, 100]
			},
			lastParams: {
				state: "all",
				offset: 0,
				limit: 25
			}
		});
	})
	.factory("Game", function (Session, Util) {
		var fn = {
			start: {
				value: function () {
					this.sessions.push(Session.create());
				}
			},
			stop: {
				value: function () {
					this.sessions[this.sessions.length-1].stop = Date.now();
				}
			}
		};
		return {
			model: {
				state: "",
				title: "",
				id: "",
				sessions: []
			},
			init: function (game) {
				if (!game) return;
				return Object.defineProperties(game, fn);
			},
			create: function (config) {
				if (!config) config = {};
				var defaults = {
					id: Util.generateID(),
					state: "active"
				};
				return angular.extend({}, angular.copy(this.model), defaults, config);
			},
			states: ["active", "finished", "dropped", "hold", "wish"]
		};
	})
	.factory("Session", function () {
		return {
			model: {
				start: 0,
				stop: 0
			},
			create: function (config) {
				if (!config) config = {};
				var defaults = {
					start: Date.now()
				};
				return angular.extend({}, angular.copy(this.model), defaults, config);
			}
		};
	})
	.filter("sumSessionsDuration", function (Util) {
		return function (sessions) {
			return sessions
			.map(function (session) {
				var diff = (session.stop || Date.now()) - session.start;
				return diff > 0 ? diff: 0;
			})
			.reduce(Util.sum, 0);
		};
	})
	.filter("sumGamesDuration", function ($filter, Util) {
		return function (games) {
			return games
			.map(function (game) {
				return game.sessions;
			})
			.map($filter("sumSessionsDuration"))
			.reduce(Util.sum, 0);
		};
	})
	.filter("state", function ($filter) {
		return function (games, state) {
			return $filter("filter")(games, state !== "all" ? {state: state} : undefined);
		};
	})

	.filter("isPlaying", function () {
		return function (game) {
			if (!game) return;
			if (!game.sessions.length) return false;

			return game.sessions[game.sessions.length - 1].stop === 0;
		};
	})
	.controller("Game", function ($scope, $stateParams, $state, $timeout, Games, Game, Paginator) {
		var leavePage = function (isRemoved) {
			if (isRemoved) $state.transitionTo("games.state", Games.lastParams);
		};
		var game = Games.getByID($stateParams.gameID);

		if (!game) leavePage(true);
		$scope.game = Game.init(game);
		$scope.$watch("game.isRemoved", leavePage);

		$scope.timeNow = Date.now();
		(function updateNow () {
			$scope.timeNow = Date.now();
			$timeout(updateNow, 10000);
		})();
	})
	.controller("Games", function ($scope, Games) {
		$scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
			angular.extend(Games.lastParams, fromParams);
		});
	})
	.controller("Pagination", function ($scope, Paginator) {
		$scope.limits = Paginator.limits;
	})
	.controller("GameControlPanel", function ($scope, Game, Games) {

	})
	.controller("Navigation", function ($scope, $stateParams, Games) {

	})
	.controller("TitleEdit", function ($scope) {
		$scope.newTitle = "";

		$scope.toggleEditing = function () {
			$scope.isEditing = !$scope.isEditing;
		};
		$scope.setNewTitle = function (value) {
			$scope.newTitle = value;
		};
	});

	angular.bootstrap(document, ["timer"]);
});