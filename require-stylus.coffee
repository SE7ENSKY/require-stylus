define ['stylus'], ->
	env = if process?.versions?.node
		"node"
	else if (window?.navigator and window?.document) or typeof importScripts isnt "undefined"
		"browser"
	else
		throw new Error 'Environment unsupported.'

	fetchText = switch env
		when 'node'
			(path, cb) ->
				cb fs.readFileSync path, 'utf8'
		when 'browser'
			getXhr = ->
				if typeof XMLHttpRequest isnt "undefined"
					return new XMLHttpRequest
				else
					for progId in ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0']
						try
							xhr = new ActiveXObject progId
							return xhr
						catch e
						throw new Error "getXhr(): XMLHttpRequest not available"

			(url, callback) ->
				xhr = getXhr()
				xhr.open 'GET', url, yes
				xhr.onreadystatechange = (evt) ->
					if xhr.readyState is 4
						callback xhr.responseText
				xhr.send null

	stylusCompiler = switch env
		when 'node' then require.nodeRequire 'stylus'
		when 'browser' then stylus


	buildMap = {}

	version: '1.0.1'

	load: (name, parentRequire, load, config) ->
		path = parentRequire.toUrl "#{name}.styl"
		fetchText path, (data) ->
			data = data.replace(///\t///g, "  ").replace(///^\s+///, "").replace(///\s+$///, "")
			stylusCompiler(data).render (err, css) ->
				throw err if err
				cssInsertString = """
					define(function(){
						var css = #{JSON.stringify css},
						    head = document.getElementsByTagName('head')[0],
						    style = document.createElement('style');

						var imports = css.match(new RegExp('@import\\\\s+url\\\\(.*\\\\);?', 'g'));
						if (imports) {
							imports.forEach(function(i){
								css = css.replace(i, '');
								var url = i.match(new RegExp('url\\\\((.*)\\\\)'))[1];
								var linkElement = document.createElement('link');
								linkElement.rel = 'stylesheet';
								linkElement.type = 'text/css';
								linkElement.href = JSON.parse(url);
								head.appendChild(linkElement);
							});
						}
						style.type = 'text/css';
						if (style.styleSheet){
							style.styleSheet.cssText = css;
						} else {
							style.appendChild(document.createTextNode(css));
						}

						head.appendChild(style);
					});
				"""
				if config.isBuild
					buildMap[name] = cssInsertString;
				load.fromText name, cssInsertString
				parentRequire [name], (value) ->
					load value

	write: (pluginName, name, write) ->
		if buildMap.hasOwnProperty name
			cssInsertString = buildMap[name]
			write.asModule "#{pluginName}!#{name}", cssInsertString
		else
			throw new Error "buildMap has no #{name}"
