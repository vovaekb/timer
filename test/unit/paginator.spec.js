describe("timer.paginator", function () {
	var Paginator;

	beforeEach(module("timer.util"));
	beforeEach(module("timer.paginator"));

	describe("services", function () {
		var keys = [
			"generatePages",
			"calcPage",
			"calcOffset",
			"generatePagination",
			"paginate",
			"caret",
			"limitDefault",
			"limits"
		].sort();

		beforeEach(inject(["Paginator", function (service) {
			Paginator = service;
		}]));

		it("has Paginator service", function () {
			expect(Paginator).toBeDefined();
		});
		it("has specified keys", function () {
			expect(Object.keys(Paginator).sort()).toEqual(keys);
		});
		it("has default values", function () {
			expect(Paginator.caret).toEqual(5);
			expect(Paginator.limitDefault).toEqual(25);
			expect(Paginator.limits).toEqual([25, 50, 100]);
		});
		it("generates pages", function () {
			var gen = Paginator.generatePages;

			expect(gen(5, 1)).toEqual([1,2,3,4,5]);
			expect(gen(5, 6)).toEqual([1]);
			expect(gen(0, 5)).toEqual([]);
			expect(gen(6, 5)).toEqual([1,2]);
		});
		it("calculates page number", function () {
			var page = Paginator.calcPage;

			expect(page(25, 0)).toEqual(1);
			expect(page(25, 25)).toEqual(2);
			expect(page(25, 50)).toEqual(3);
			expect(page(25, 250)).toEqual(11);
		});
		it("calculates offset", function () {
			var off = Paginator.calcOffset;

			expect(off(1, 25)).toEqual(0);
			expect(off(2, 25)).toEqual(25);
			expect(off(6, 6)).toEqual(30);
			expect(isNaN(off())).toBeTruthy();
		});
		it("generates pagination", function () {
			var gen = Paginator.generatePagination,
				pages = Paginator.generatePages;

			expect(gen(pages(3, 1), 1)).toEqual([1,2,3]);
			expect(gen(pages(3, 1), 2)).toEqual([1,2,3]);
			expect(gen(pages(3, 1), 3)).toEqual([1,2,3]);

			expect(gen(pages(100, 10), 1)).toEqual([1,2,3,4,5,-5,10]);
			expect(gen(pages(100, 10), 2)).toEqual([1,2,3,4,5,-5,10]);
			expect(gen(pages(100, 10), 3)).toEqual([1,2,3,4,5,-5,10]);
			expect(gen(pages(100, 10), 4)).toEqual([1,2,3,4,5,6,-6,10]);
			expect(gen(pages(100, 10), 5)).toEqual([1,-1,3,4,5,6,7,-7,10]);
			expect(gen(pages(100, 10), 6)).toEqual([1,-1,4,5,6,7,8,-7,10]);
			expect(gen(pages(100, 10), 7)).toEqual([1,-1,5,6,7,8,9,10]);
			expect(gen(pages(100, 10), 8)).toEqual([1,-1,6,7,8,9,10]);
			expect(gen(pages(100, 10), 9)).toEqual([1,-1,6,7,8,9,10]);
			expect(gen(pages(100, 10), 10)).toEqual([1,-1,6,7,8,9,10]);
		});
		it("paginates", function () {
			var pag = Paginator.paginate;

			expect(pag(100, 10, 0)).toEqual([1,2,3,4,5,-5,10]);
			expect(pag(100, 10, 10)).toEqual([1,2,3,4,5,-5,10]);
			expect(pag(100, 10, 20)).toEqual([1,2,3,4,5,-5,10]);
			expect(pag(100, 10, 30)).toEqual([1,2,3,4,5,6,-6,10]);
			expect(pag(100, 10, 40)).toEqual([1,-1,3,4,5,6,7,-7,10]);
			expect(pag(100, 10, 50)).toEqual([1,-1,4,5,6,7,8,-7,10]);
			expect(pag(100, 10, 60)).toEqual([1,-1,5,6,7,8,9,10]);
			expect(pag(100, 10, 70)).toEqual([1,-1,6,7,8,9,10]);
			expect(pag(100, 10, 80)).toEqual([1,-1,6,7,8,9,10]);
			expect(pag(100, 10, 90)).toEqual([1,-1,6,7,8,9,10]);
		});
	});
});