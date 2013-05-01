define ['./stylus'], ->
	load: (name, req, onload, config) ->
		$.get "#{name}.styl", (data) ->
			data = data.replace(///\t///g, "  ").replace(///^\s+///, "").replace(///\s+$///, "")
			stylus(data).render (err, str) ->
				throw err if err
				$('head').append "<style>#{str}</style>"
				onload yes