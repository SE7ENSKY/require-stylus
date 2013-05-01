require-stylus
==============

RequireJS Stylus module

Installation
------------
```bower install require-stylus```

Usage
-----
```javascript
require.config({
  "paths": {
    "stylus": "components/require-stylus/stylus",
    "styl": "components/require-stylus/require-stylus"
  }
});

require(['styl!styles']); // styles.styl
```

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
