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

		it("has Util service", function () {
			expect(Util).toBeDefined();
		});
		it("exposes specified functions", function () {
			expect(Object.keys(Util).sort()).toEqual(keys);
		});
		it("sums", function () {
			var sum = Util.sum;
			expect(sum(2,2)).toEqual(4);
			expect(sum("2","2")).toEqual("22");
			expect(isNaN(sum(2, undefined))).toBe(true);
		});
	});
	describe("controllers", function () {

	});
	describe("services", function () {

	});
	describe("directives", function () {

	});
});