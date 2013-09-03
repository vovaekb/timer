describe("timer.util", function () {
	var Util;

	beforeEach(module("timer.util"));
	beforeEach(function () {
		inject(["Util", function (module) {
			Util = module;
		}]);
	});

	describe("filters", function () {
		
	});
	describe("services", function () {
		var keys = [
			"sum",
			"mult",
			"generateID",
			"pad",
			"toB64",
			"last",
			"memoize",
			"range"
		].sort();

		it("should have Util service", function () {
			expect(Util).toBeDefined();
		});
		it("should expose specified functions", function () {
			expect(Object.keys(Util).sort()).toEqual(keys);
		});
	});
	describe("controllers", function () {

	});
	describe("services", function () {

	});
	describe("directives", function () {

	});
});