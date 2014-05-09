smart-function
==============

This simple library help you in the repetitive task of validate, normalize and interpolate the data (parameters) you receive in your functions.

The goal is to ensure that your function **code will only be executed if all the required parameters pass the expected data type.**
All data types are fully customized and can be shared across your entire application. A data type is responsible of:

- **Validate:** Check if the data is valid (e.g.: email, number, etc.)
- **Normalize:** Manipulate/sanitize the data (e.g.: trim, htmlentities, etc)
- **Interpolate:** Receive one value and return another (e.g.: receive a ID and return the entire table record)

## Motivation
I'm tired of having to manually validate, normalize and (sometimes) manipulate/interpolate data before actually start coding.
Also, when doing code reviews, the worst part is to check if all params are being fully validated and sanitized. 


## TLDR

Imagine you have a function that sums two numbers but only if they are valid integer, you typically do something like:

```js
function sum (x, y){

	// validate x
	if (x == undefined || !isInteger(x))
		return

	// validate y
	if (y == undefined || !isInteger(y))
		return

	// If we are here, all the params have been successfully validated, lets finally do our stuff:
	return x+y;
}

sum(1+1);
// 2
```


With smart-function for each parameter, you define if they are required and the expected data type: 

```js
sf.method.sum = {
	params: {
	  x: { required: true, type: 'number'},
	  y: { required: true, type: 'number'}
	},
	action: function(params, output, context)
	{
		// If we are here, all the params have been successfully validated, lets finally do our stuff:
		return params.x + params.y;
	}
})

sf.call('sum', {x:1, y:1});
// 2
```

This is just a plain-stupid example, but i guess you get the point. 
Check the examples for really exciting usage.




## Nice side effects
- Automatically code documentation
- Confidence about input filtering/validation
- Security, you can do extensive unit test in your data types
- Auto params normalization, validation and interpolation (Optional)
- Unified error codes


## Features / Goals

- Minimal implementation (Less than 130 LOC with comments)
- Works everywhere (browser/client and server)
- Flexible and extendable
- No dependencies
- Fully asynchronous
- Unit testable







# API

### INIT
```js
var sf = smartFunction({
	methods: {},				// Your methods
	types: {},					// [Optional] Object of types to use
	errors: {},					// [Optional] Your error codes
});
```


## METHODS

Your can define your methods in the initialization:

```js
var sf = smartFunction({
	methods: {
		sum: {
			params: {
			  x: { required: true, type: 'number'},
			  y: { required: true, type: 'number'}
			},
			action: function(params, output, context)
			{
				return x+y;
			}
		},
		subtract: {
			params: {
			  x: { required: true, type: 'number'},
			  y: { required: true, type: 'number'}
			},
			action: function(params, output, context)
			{
				return x-y;
			}
		}		
	}
});
```

Or after initialization:

```js
sf.method.sum = {
	params: {
	  x: { required: true, type: 'number'},
	  y: { required: true, type: 'number'}
	},
	action: function(params, output, context)
	{
		return x+y;
	}
}

sf.method.subtract = {
	params: {
	  x: { required: true, type: 'number'},
	  y: { required: true, type: 'number'}
	},
	action: function(params, output, context)
	{
		return x-y;
	}
}
```



## TYPES

Types are plain JS functions. Your receive the data (value param) and then you do your validation/normalization/interpolation/whatever and in the end you have two options:

FAIL: When the validation fails and you want to abort you use:
```js
cb(true, 'Your error message or error code');
```

SUCCESS: When the validation passes you use:
```js
cb(null, 'The final data to pass');
```

This callback have the default js syntax 'cb(<error>, <value>)'




Types are plain js functions that receive:
- **Value:** The value to be evaluated
- **Options:** Optional params to the validation (eg: in a minMax validation you can pass the max and min values)
- **Cb:** The callback to call when you have the final decision. Since all code is asynchronous, fell free to do what you want (e.g.: wait for database, external API, etc.). 

This callback have the default JS syntax 'cb(<error>, <value>)'

You can define all your types in the initialization, or using the following method:



```js
sf.type.nameOfType = function(value, options, cb) {

	// We make our validation logic here

	// If it fails, cb with the error flag
	if (value != 'expectedValue')
		cb(true, 'Enexpected value')

	// If it is ok, we cb with out final data (here we are trimming the value)
		cb(null, value.trim())
},
```

Smart-function already ships with 3 default types: string, float and number, but feel free to overwrite it.








## Example

As you probably already know, the real power start when you need validation/normalization that happens in multiple parts of your application.

Lets say you have a function that receives a ID of a record of the table users and you print the username. You typically have to:

- Validate the integer
- Check if is a valid record, and fetch

Lets create a new type called "validUser":   

```js
sf.type.validUser = function(value, options, cb) {

	// Warning: basic and insecure example, just for reference
	var user = db("select * from user where id ="+value);

	if (user == undefined)
		{
			// If invalid user the validation will no pass
			cb(true, 'User not found');
		} else {
			// If the user is valid, we will return the user (interpolation)
			cb(null, user);
		}
},
```

Now that we have a new type we can use it accross our entire application:

```js

sf.method.subtract = {
	params: {
	  user: { required: true, type: 'validUser'},
	},
	action: function(params, output, context)
	{
		// Since the 'validUser' also interpolates data, the 'params.user' now have the user DB record
		return params.user.username; 
	}
}

```





---
## License 

(The MIT License)

Copyright (c) 2014, Hugo Rodrigues <hugo@starteffect.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


