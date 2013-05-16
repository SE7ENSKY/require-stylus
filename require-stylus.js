// Generated by CoffeeScript 1.6.2
define(['stylus'], function() {
  var buildMap, env, fetchText, getXhr, stylusCompiler;

  env = (function() {
    var _ref;

    if (typeof process !== "undefined" && process !== null ? (_ref = process.versions) != null ? _ref.node : void 0 : void 0) {
      return "node";
    } else if (((typeof window !== "undefined" && window !== null ? window.navigator : void 0) && (typeof window !== "undefined" && window !== null ? window.document : void 0)) || typeof importScripts !== "undefined") {
      return "browser";
    } else {
      throw new Error('Environment unsupported.');
    }
  })();
  fetchText = (function() {
    switch (env) {
      case 'node':
        return function(path, cb) {
          return cb(fs.readFileSync(path, 'utf8'));
        };
      case 'browser':
        getXhr = function() {
          var e, progId, xhr, _i, _len, _ref;

          if (typeof XMLHttpRequest !== "undefined") {
            return new XMLHttpRequest;
          } else {
            _ref = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              progId = _ref[_i];
              try {
                xhr = new ActiveXObject(progId);
                return xhr;
              } catch (_error) {
                e = _error;
              }
              throw new Error("getXhr(): XMLHttpRequest not available");
            }
          }
        };
        return function(url, callback) {
          var xhr;

          xhr = getXhr();
          xhr.open('GET', url, true);
          xhr.onreadystatechange = function(evt) {
            if (xhr.readyState === 4) {
              return callback(xhr.responseText);
            }
          };
          return xhr.send(null);
        };
    }
  })();
  stylusCompiler = (function() {
    switch (env) {
      case 'node':
        return require.nodeRequire('stylus');
      case 'browser':
        return stylus;
    }
  })();
  buildMap = {};
  return {
    version: '1.0.1',
    load: function(name, parentRequire, load, config) {
      var path;

      path = parentRequire.toUrl("" + name + ".styl");
      return fetchText(path, function(data) {
        data = data.replace(/\t/g, "  ").replace(/^\s+/, "").replace(/\s+$/, "");
        return stylusCompiler(data).render(function(err, css) {
          var cssInsertString;

          if (err) {
            throw err;
          }
          cssInsertString = "define(function(){\n	var css = " + (JSON.stringify(css)) + ",\n	    head = document.getElementsByTagName('head')[0],\n	    style = document.createElement('style');\n\n	var imports = css.match(new RegExp('@import\\\\s+url\\\\(.*\\\\);?', 'g'));\n	imports.forEach(function(i){\n		css = css.replace(i, '');\n		var url = i.match(new RegExp('url\\\\((.*)\\\\)'))[1];\n		var linkElement = document.createElement('link');\n		linkElement.rel = 'stylesheet';\n		linkElement.type = 'text/css';\n		linkElement.href = JSON.parse(url);\n		head.appendChild(linkElement);\n	});\n	style.type = 'text/css';\n	if (style.styleSheet){\n		style.styleSheet.cssText = css;\n	} else {\n		style.appendChild(document.createTextNode(css));\n	}\n\n	head.appendChild(style);\n});";
          if (config.isBuild) {
            buildMap[name] = cssInsertString;
          }
          load.fromText(name, cssInsertString);
          return parentRequire([name], function(value) {
            return load(value);
          });
        });
      });
    },
    write: function(pluginName, name, write) {
      var cssInsertString;

      if (buildMap.hasOwnProperty(name)) {
        cssInsertString = buildMap[name];
        return write.asModule("" + pluginName + "!" + name, cssInsertString);
      } else {
        throw new Error("buildMap has no " + name);
      }
    }
  };
});
