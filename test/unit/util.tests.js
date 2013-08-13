define(["angular", "angularmocks", "app/util"], function () {

	beforeEach(module("timer.util"));

	describe("service tests", function () {
		var Util;

		beforeEach(function () {
			inject(["Util", function (U) {
				Util = U;
			}]);
		});

		it("should have Util service", function () {
			expect(Util).toBeDefined();
		});

		it("should expose methods", function () {
			["sum", "mult", "generateID", "pad", "toB64", "last", "memoize", "range"]
			.forEach(function (method) {
				expect(Util[method]).toBeDefined();
			});
		});

		it("should sum", function () {
			expect(Util.sum(2, 2)).toEqual(4);
		});

		it("should multiply", function () {
			expect(Util.sum(2, 2)).toEqual(4);
		});

		it("should generate ID", function () {
			var before = Date.now(),
				id = Util.generateID();

			expect(parseInt(id, 36)).toEqual(before);
		});

		it("should pad", function () {
			expect(Util.pad(2)).toEqual("02");
		});

		it("should return last array item", function () {
			expect(Util.last([1,2,3,4,5])).toEqual(5);
		});

		it("should generate ranges", function () {
			expect(Util.range(3)).toEqual([0, 1, 2]);
			expect(Util.range(3, 1)).toEqual([1, 2, 3]);
		});

		it("should memoize", function () {
			var func = Util.memoize(Util.range),
				first = func(5, 1),
				second = func(5, 1);

			expect(first).toBe(second);
		});
	});
});