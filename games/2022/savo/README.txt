ts: Template for TypeScript

Installation
	tmpl ts my-project-name
	cd my-project-name

Compiling TypeScript: tsc
	This uses the tsconfig.json and watches for changes / errors automatically.

Deployment
	The actual TypeScript .ts file isn't used anywhere. TypeScript compiles to
	JavaScript .js files, which are used by your html files. To send someone your
	app, send them the html and the js, not the ts, unless you want them to compile
	it themselves for some reason.
