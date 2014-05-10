module.exports = function(config){
	var config = config || {}
	var obj = {}

	// Default errors
	obj.errors = {
		'-32601': { msg: 'Method not found' },
		'-32602': { msg: 'Invalid method parameter(s)' },
		'-326021': { msg: 'Internal error' }
	}

	// All methods will be stored here
	obj.methods = {}

	// Defaults params types (validation + normalization)
	obj.types = {
		"_typeNotFound": function(value, options, cb) { cb(true, '_typeNotFound') },
		"float": function(value, options, cb) { if (!/^\s*$/.test(value) && !isNaN(value)) cb.success(value); else cb.error('0', 'Invalid float'); },
		"integer": function(value, options, cb) { if (value === +value && value === (value|0)) cb.success(value); else cb.error('0', 'Invalid integer'); },
	}

	// METHOD: Define a new
	obj.set = function(name, params, code)
	{
		obj.methods[name] = {
			params: params,
			action: code
		}
	}

	// METHOD: Call a defined method/function
	obj.call = function(method, params, cb, context)
	{
		// validate requested method
		if (obj.methods[method] == undefined)
			return obj.callError(cb, -32601)

		// validate params object
		if (typeof params != 'object' || params == null)
			return obj.callError(cb, -32602)

		// Validate requested params
		obj.paramsTypeValidation(obj.methods[method].params, params, function(error, data){

			if (error)
				return obj.callError(cb, -32602, null, data )

			// Execute Requested method and expose callbacks to the action
			obj.methods[method].action(data, {
				success:function(response) { cb(null, response) }, 
				error:function (errorCode, errorMsg) { obj.callError(cb, errorCode, errorMsg) }
			}, context);

		})
	}

	obj.callError = function(cb, errorCode, errorMsg, errorData){
		var error = {code: errorCode, message: errorMsg}

		if (obj.errors[errorCode] && error.message == null)
			error.message = obj.errors[errorCode].message;

		if (errorData)
			error.data = errorData;

		cb(error)
	}

	// TYPES: Set and call
	obj.type = {
		set: function(name, code){
			obj.types[name] = code;
		},
		call: function(name, value, options, cb){
			obj.types[name](value, options, {
				success: function(data){ cb(null, data) },
				error: function(errorCode, errorMessage, errorData){ obj.callError(cb, errorCode, errorMessage, errorData) },
			})
		}
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
			if (typeof obj.types[work.type[0]] != "function")
				work.type[0] = '_typeNotFound';

			// Call type validation
			obj.type.call(work.type[0], work.value, work.type[1], function (error, data){

				if (error) 
					errors[work.param] = error;//{code:error, errorMessage: data}
				else 
					values[work.param] = data

				recursion();
			})

		}

		recursion()
	}

	// Helper - Empty object?
	obj.isEmpty = function(obj) {
	  for(var prop in obj) if(obj.hasOwnProperty(prop)) return false;
	  return true;
	}

	// Helper - Merge objects
	obj.defaults = function(defaults, config){
		if (config) for (key in config) defaults[key] = config[key];
		return defaults
	}

	// Merge user configs
	obj.errors = obj.defaults(obj.errors, config.errors);
	obj.types = obj.defaults(obj.types, config.types);
	obj.methods = obj.defaults(obj.methods, config.methods);

	return obj;
}