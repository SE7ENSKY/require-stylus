require-stylus
==============

RequireJS Stylus loader module.

Features
--------
* compile *.styl files on-the-fly
* insert compiled CSS into ```<head>```
* optimize support (resulting CSS will be compiled into resulting javascript)

Browser support
---------------
Development works on all major browsers.
IE7+ works after optimize.

Installation
------------
```bower install require-stylus```

Usage
-----
```javascript
require.config({
  "map": {
    "*": {
      "styl": "components/require-stylus/require-stylus", // RequireJS loader plugin
      "stylus": "components/require-stylus/stylus" // client-side stylus compiler instance (can/should be substituted with actual required stylus version)
    }
  }
});

require(['styl!path/to/styles']); // path/to/styles.styl
```

Optimizer
---------
Example Gruntfile.coffee:
```coffeescript
module.exports = (grunt) ->
	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'

		requirejs:
			compile:
				options:
					baseUrl: "."
					include: "main.js"
					out: "main.min.js"
					stubModules: [ 'styl' ]
					exclude: [ 'stylus' ]
					paths:
						"styl": "components/require-stylus/require-stylus",
						"stylus": "components/require-stylus/stylus",

	grunt.loadNpmTasks 'grunt-contrib-requirejs'

	grunt.registerTask 'default', ['requirejs']
```

ToDo
----
* @import support for stylus

Authors
-------
* [Ivan Kravchenko](http://github.com/krava)
* [Se7enSky studio](http://www.se7ensky.com/)

License
-------
Anything you wish:
* MIT (just free)
* JSON (use for Good, not Evil)
* AYFL (Any Yourself Fucking License)
