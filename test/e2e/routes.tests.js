define([], function () {

	beforeEach(function () {
		sleep(3);
		browser().navigateTo("/app/index.html");
	});

	describe("routes", function () {
		it("should have /settings route", function () {
			// browser().navigateTo("/#settings");
			// expect(element("body").html()).toBe("ttse");
			expect(browser().location().path()).toBe("#/index");
		});
	});
});