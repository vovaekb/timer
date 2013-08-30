describe('basic tests', function () {
	var p = protractor,
		i;

	it('should open index', function () {
		i = p.getInstance();
		i.get('app/index.html#/index');

		var view = i.findElement(p.By.css('ui-view'));

		expect(view.getText()).toEqual('Wellcome!');
	});
	it('should validate game adding form', function () {
		var form = i.findElement(p.By.css('.navbar-form'));
		i.findElement(p.By.input('title')).sendKeys('test');
		expect(form.getAttribute('class'))
		.toEqual("navbar-form pull-right input-group ng-dirty ng-valid ng-valid-required");
	});
	it('should add games', function () {
		i.findElement(p.By.css('.navbar-form')).submit();
		setTimeout(function () {
			expect(i.getCurrentUrl()).toMatch(/#\/games\/\w+$/);
		}, 5000);
	}, 10000);
	it('redirect to games', function () {
		i.get('app/index.html#/games/');
		setTimeout(function () {
			expect(i.getCurrentUrl()).toContain('games/all?offset=0&limit=25');
		}, 5000);
	}, 10000);
});