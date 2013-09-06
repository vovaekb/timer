describe("timer.util", function () {
	var Util, $filter;

	beforeEach(module("timer.util"));
	beforeEach(function () {
		inject(["Util", "$filter", function (module, filter) {
			Util = module;
			$filter = filter;
		}]);
	});

	describe("filters", function () {
		var keys = [
			"last",
			"duration"
		].sort();

		it("has specified filters", function () {
			var checkedKeys = keys.filter(function (key) {
				return !!$filter(key);
			}).sort();
			expect(checkedKeys).toEqual(keys);
		});
		it("returns last array entry", function () {
			var last = $filter("last");

			expect(last).toBe(Util.last);
		});
		it("formats duration", function () {
			var dur = $filter("duration");

			expect(dur).toThrow("Duration value is required");
			expect(dur(-1)).toBeUndefined();
			expect(dur(0)).toBeUndefined();
			expect(dur(1)).toEqual("00:00");
			expect(dur(60 * 1000)).toEqual("00:01");
			expect(dur(15 * 60 * 1000)).toEqual("00:15");
			expect(dur(3600 * 1000)).toEqual("01:00");
			expect(dur(120 * 3600 * 1000)).toEqual("120:00");
		});
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
		it("multiplies", function () {
			var mult = Util.mult;
			expect(mult(2,2)).toEqual(4);
			expect(mult(2,-2)).toEqual(-4);
			expect(mult(2,0)).toEqual(0);
			expect(isNaN(mult(2))).toBe(true);
		});
		it("generates ID", function () {
			var now = Date.now(),
				id = Util.generateID();

			expect(id).toEqual(now.toString(36));
		});
		it("pads", function () {
			var pad = Util.pad;

			expect(pad(0)).toEqual("00");
			expect(pad(12)).toEqual(12);
			expect(pad(3)).toEqual("03");
		});
		it("converts to urlencoded unescaped base64", function () {
			var data = "test",
				result = "dGVzdA==";

			expect(Util.toB64(data)).toEqual(result);
		});
		it("returns last array entry", function () {
			var last = Util.last;

			expect(last([0,1,2,3,4,5])).toEqual(5);
			expect(last([1])).toEqual(1);
			expect(last([])).toBeUndefined();
			expect(last).toThrow();
		});
		it("memoizes", function () {
			var data = {a:1,b:2,c:3};
			var func = function (input) {
				return angular.copy([input, "test", 123]);
			};
			var funcMem = Util.memoize(func);
			var memoized_1 = funcMem(data),
				memoized_2 = funcMem(data),
				result_1 = func(data),
				result_2 = func(data);

			expect(memoized_1 === memoized_2).toBeTruthy();
			expect(result_1 === result_2).toBeFalsy();
			expect(result_1).not.toBe(result_2);
			expect(memoized_1).toBe(memoized_2);
		});
		it("prodcues ranges", function () {
			var range = Util.range;

			expect(range).toThrow("Amount is required");
			expect(range.bind(null, -4)).toThrow("Amount should be positive");
			expect(range(0)).toEqual([]);
			expect(range(1)).toEqual([0]);
			expect(range(3)).toEqual([0,1,2]);
			expect(range(3,1)).toEqual([1,2,3]);
			expect(range(3,-1)).toEqual([-1,0,1]);
		});
	});
	describe("directives", function () {
		var $compile, $rootScope;

		beforeEach(inject(["$compile", "$rootScope", function (c, r) {
			$compile = c;
			$rootScope = r;
		}]));

		it("reads files", function () {
			$rootScope.callback = function (data) {
				$rootScope.result = data;
			};

			var el = $compile('<input type="file" load-file="callback">')($rootScope),
				spy = spyOn($rootScope, "callback").andCallThrough(),
				text = "testing the direcive",
				file = new Blob([text]);

			el[0].files[0] = file;
			el.triggerHandler("change");

			waitsFor(function () {
				return !!$rootScope.result;
			});

			runs(function () {
				expect(spy).toHaveBeenCalled();
				expect($rootScope.result).toEqual(text);
			});
		});
	});
});