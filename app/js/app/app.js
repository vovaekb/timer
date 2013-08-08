define(function () {
	angular
	.module("timer", ["ui", "ui.state", "ui.bootstrap"])
	.run(function ($rootScope, $state, Games, Game) {
		$rootScope.$state = $state;
		$rootScope.Games = Games;
		$rootScope.Game = Game;
		$rootScope.$watch(Games.watcher, Games.watcherCallback);
	})
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
	.factory("Util", function () {
		return {
			sum: function (a, b) {
				return a + b;
			},
			mult: function (a, b) {
				return a * b;
			},
			generateID: function () {
				return Date.now().toString(36);
			},
			pad: function (value) {
				return (value || 0).toString().length === 1 ? "0" + value : value;
			},
			toB64: function (value) {
				return btoa(unescape(encodeURIComponent(value)));
			},
			last: function (array) {
				if (!array.length) return undefined;
				return array[array.length - 1];
			},
			memoize: function (func) {
				var memo = {};
				return function () {
					var key = JSON.stringify(arguments);
					return memo[key] ? memo[key] : (memo[key] = func.apply(this, arguments));
				};
			},
			range: function (amount, offset) {
				return Array(amount)
				.join(".").split(".")
				.map(function (val, i) {return i + (offset || 0) });
			}
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
	.directive("loadFile", function () {
		var fr = new FileReader();

		return function ($scope, el, attr) {
			fr.onload = function () {
				$scope.$eval(attr.loadFile)(fr.result);
			};
			el.bind("change", function () {
				fr.readAsText(el[0].files[0]);
			});
		};
	})
	.filter("last", function (Util) {
		return Util.last;
	})
	.filter("sumSessionsDuration", function (Util) {
		return function (sessions) {
			return sessions
			.map(function (session) {
				var diff = (session.stop||Date.now()) - session.start;
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
			return $filter("filter")(games, (state !== "all") ? {state: state} : undefined);
		};
	})
	.filter("duration", function (Util) {
		return function (value) {
			if (value <= 0) return undefined;

			return ["h","m"]
			.map(function (part) {
				switch (part) {
					case "h":
						return ~~(value / 3600000);
					case "m":
						return ~~((value % 3600000) / 60000);
				}
			})
			.map(Util.pad)
			.join(":");
		};
	})
	.filter("isPlaying", function () {
		return function (game) {
			if (!game.sessions.length) return false;

			return game.sessions[game.sessions.length - 1].stop === 0;
		};
	})
	.filter("paginate", function () {
		return function (array, offset, limit) {
			return array.slice(offset, offset + limit);
		};
	})
	.filter("pages", function (Util) {
		return function (array, limit, offset) {
			return Util
			.range(Math.ceil(array.length / limit))
			.map(Util.sum.bind(this, 1));
		};
	})
	.controller("Game", function ($scope, $stateParams, $state, $q, $timeout, Games, Game) {
		var leavePage = function (isRemoved) {
			if (isRemoved) $state.transitionTo("games");
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
	.controller("Pagination", function ($scope, $state, Games, $filter, Util) {
		var nearPagesAmount = 5,
			nearOffset = ~~(nearPagesAmount / 2);

		$scope.currentPage = function () {
			var offset = $state.params.offset,
				limit = $state.params.limit;

			return $scope.pages.indexOf(offset / limit) + 1;
		};

		$scope.nearPages = function () {
			var current = $scope.currentPage(),
				pagesBefore = current,
				isInStart = current < (nearPagesAmount - 1),
				isInEnd = current > ($scope.pages.length - nearPagesAmount),
				pagesAfter = $scope.pages.length - current - 1,
				offsetBefore = nearOffset,
				offsetAfter = nearPagesAmount - offsetBefore;

			if ($scope.pages.length <= (nearPagesAmount + 1)) return $scope.pages;

			if (isInStart) {
				offsetBefore = ((pagesBefore - 1) <= nearOffset) ? pagesBefore : nearOffset;
				offsetAfter = nearPagesAmount - (offsetBefore);
			} else
			if (isInEnd) {
				offsetAfter = (pagesAfter > (nearOffset + 1)) ? nearOffset : pagesAfter + 1;
				offsetBefore = nearPagesAmount - offsetAfter;
			}

			return $scope.pages.slice(current - offsetBefore, current + offsetAfter);
		};

		$scope.changePage = function (page) {
			$state.params.offset = ((page - 1) * $state.params.limit);
			console.log("Page: ", $state.params.offset / $state.params.limit, $scope.pages.length);
		};
	})
	.controller("Games", function ($scope) {
		Object.defineProperties($scope, {
			pages: {
				get: function () {
					return $scope.$eval("Games.data|state:$state.params.state|pages:$state.params.limit:$state.params.offset");
				},
				set: angular.noop
			},
			games: {
				get: function () {
					return $scope.$eval("(Games.data|orderBy:'-(sessions|last).start'|state:$state.params.state|paginate:$state.params.offset:$state.params.limit)");
				},
				set: angular.noop
			}
		});
	})
	.controller("GamesAdder", function ($scope, Games) {

	})
	.controller("GameControlPanel", function ($scope, Game, Games) {

	})
	.controller("Navigation", function ($scope, $stateParams, Games) {

	});

	angular.bootstrap(document, ["timer"]);
});