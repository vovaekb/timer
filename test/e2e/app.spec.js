describe("routes", function () {
	beforeEach(function () {
		sleep(1);
	});
	it("navigate to index", function () {
		browser().navigateTo("/app/index.html");
		browser().navigateTo("#/index");
		expect(element("ui-view").text()).toBe("Wellcome!");
	});
	it("validate game adding form", function () {
		input("title").enter("Test");
		expect(element("header form.ng-valid").count()).toEqual(1);
	});
	// it("add games", function () {
	// 	element("header form.ng-valid button").click();
	// 	sleep(1);
	// 	expect(browser().location().path()).toEqual("#/game");
	// });
	it("redirect to game", function () {
		browser().navigateTo("#/games");
		// sleep(10);
		expect(browser().window().href()).toEqual("/games");
	});
});