require.config({
	baseUrl: "js",
	paths: {
		jquery: "lib/jquery/jquery",
		angular: "lib/angular/angular",
		angularui: "lib/angular-ui/angular-ui",
		angularuirouter: "lib/angular-ui-router/angular-ui-router",
		angularbs: "lib/angular-bootstrap/ui-bootstrap-0.6.0-SNAPSHOT",
		timer: "app/app"
	},
	shim: {
		angularui: ["angular", "jquery"],
		angularuirouter: ["angular"],
		angularbs: ["angular"]
	}
});

require(["timer"]);