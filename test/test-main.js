var tests = [];
for (var file in window.__karma__.files) {
	if (/tests\.js$/.test(file)) {
		tests.push(file);
	}
}
requirejs.config({
	baseUrl: "base/app/js",
	paths: {
		angular: "lib/angular/angular",
		// angularui: "lib/angular-ui/angular-ui",
		// angularuirouter: "lib/angular-ui-router/angular-ui-router",
		// angularbs: "lib/angular-bootstrap/ui-bootstrap-0.6.0-SNAPSHOT",
		angularmocks: "../../test/angular-mocks",
		// timer: "app/app"
	},
	shim: {
		// angularui: ["angular"],
		// angularuirouter: ["angular"],
		// angularbs: ["angular"],
		angularmocks: ["angular"],
		// angularscenario: ["angular"]
	},
	deps: tests,
	callback: window.__karma__.start
});