module.exports = function(config){
	
	var config = config || {}
	var obj = {}

	// All methods will be stored here
	obj.method = {}

	// Default errors
	obj.errors = {
		'-32601': { msg: 'Method not found' },
		'-32602': { msg: 'Invalid method parameter(s)' },
		'-326021': { msg: 'Internal error' }
	}

	// Defaults params types (validation + normalization)
	obj.type = {
		"_typeNotFound": function(value, options, cb) { cb(true, '_typeNotFound') },
		//"string": function(value, options, cb) { cb(null, value.trim())  },
		"float": function(value, options) { return !/^\s*$/.test(value) && !isNaN(value); },
		"integer": function(value, options) { return value === +value && value === (value|0); },
	}

	obj.setup = function(config){
		// Merge user configs
		obj.errors = obj.defaults(obj.errors, config.errors);
		obj.type = obj.defaults(obj.type, config.types);
		obj.method = obj.defaults(obj.method, config.methods);
	}

	// Main input flow
	obj.call = function(method, params, cb, context)
	{
		// validate requested method
		if (obj.method[method] == undefined)
			return obj.callError(cb, -32601)

		// Validate requested params
		obj.paramsTypeValidation(obj.method[method].params, params, function(error, data){
		
			// Execute Requested method and expose callbacks to the action
			obj.method[method].action(data, {
				win:function(output) { cb(null, output) }, 
				fail:function (code, msg) { cb(true, code, msg) }
			}, context);

		})
	};

	obj.callError = function(cb, errorCode, errorMsg){
		cb(true, errorCode, errorMsg)
	}

	obj.paramsTypeValidation = function(params, data, cb){

		var errors = {}
		var values = {}

		// Validate requested params
		var queue = [];
		for ( param in params)
			queue.push({param: param, type: params[param].type, value: data[param]})

		function recursion(){

			var work = queue.shift();

			// If no more work, set complete
			if (work == undefined)
			{
				if (obj.isEmpty(errors))
					return cb(null, values);
				else
					return cb(true, errors);
			}

			// If the "type" in method param is String, add the default function param (null)
			if( typeof work.type === 'string' )
			  work.type = [work.type, null]

			// Is a valid validation type function ? 
			if (typeof obj.type[work.type[0]] != "function")
				work.type[0] = '_typeNotFound';

			obj.type[work.type[0]](work.value, work.type[1], function (error, data){

				if (error == true)
					errors[work.param] = data
				else
					values[work.param] = data

				recursion();
			})			
		}

		recursion()
	}

	obj.isEmpty = function(obj) {
	  for(var prop in obj) {
	    if(obj.hasOwnProperty(prop))
	      return false;
	  }

	  return true;
	}

	obj.defaults = function(defaults, config){

		if (config)
			for (key in config)
				defaults[key] = config[key];
			
		return defaults
	}

	obj.setup(config)
	return obj;
}