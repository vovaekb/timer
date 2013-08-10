define(["angular"], function () {
	angular.module("timer.util", [])
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
				.map(function (value, index) {
					return index + (offset || 0);
				});
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
	.filter("last", function (Util) {
		return Util.last;
	});
});