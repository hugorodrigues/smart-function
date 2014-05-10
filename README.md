smart-function
==============
[![Build Status](https://travis-ci.org/hugorodrigues/smart-function.svg?branch=master)](https://travis-ci.org/hugorodrigues/smart-function)

This simple library help you in the repetitive task of validate, normalize and interpolate the data (parameters) you receive in your functions.

The goal is to ensure that your function **code will only be executed if all the required parameters pass the expected data type.**
All data types are fully customized and can be shared across your entire application. A data type is responsible of:

- **Validate:** Check if the data is valid (e.g.: email, number, etc.)
- **Normalize:** Manipulate/sanitize the data (e.g.: trim, strip html, encode, etc)
- **Interpolate:** Receive one value and return another (e.g.: receive a ID and return the entire table record)

## Motivation
I'm tired of having to manually validate, normalize and (sometimes) manipulate/interpolate function parameters before actually start coding.
Also, when doing code reviews, the worst part (and prone to security vulnerabilities) is to check if all parameters are being fully validated and sanitized. 

I also need a way to centralize and unit-test all this validations, normalizations and interpolations types.


## TLDR

Imagine you have a function that is responsible of update a user e-mail address. You typically have something like this:

```js
function updateUserEmail (userId, newEmail, cb){

	// validate ID
	if (userId == undefined || !isInteger(userId))
		return cb('Error: Invalid Id')

	// validate e-email
	if (newEmail == undefined || !validEmail(newEmail))
		return cb('Error: Invalid E-mail')

	// Lets fetch the DB Record
	db_userFetch(userId, function(error, data){

		if (error)
			{
				return cb('Error: User is not on DB')
			} else {

				// OK, we FINALLY got everything we need, lets do our code
				db_userUpdate(userId, {email: newEmail}, function(error, data){

					if (error)
						cb(error)
					else
						cb(null, data)

				})
			}
	});
}


updateUserEmail(1, 'test@example.com', function(error, result){
	console.log(error, result);
})

```

As you can see, most of the code is just validating the needed parameters.
With Smart-function you can skip that repetitive process:

```js

sf.set('updateUserEmail', {
	userId: { required: true, type: 'user'},
	newEmail: { required: true, type: 'email'}
}, function(params, cb){
	
	// OK, we FINALLY got everything we need, lets do our code
	userUpdate(userId, {email: newEmail}, function(error, data){

		if (error)
			cb.error(error)
		else
			cb.sucess(data)

	})

})

sf.call('updateUserEmail', {userId: 1, newEmail: 'test@example.com'}, function(error, result){
	console.log(error, result);
})

```

As you can see, using smart-function you stop mixing validation/normalization/interpolation logic inside your function code.
All those used `types` (user and email) are fully customized and can be reused across your entire stack.


## Features / Goals
- Minimal implementation (Less than 130 LOC with comments)
- Works everywhere (browser and server)
- Flexible, extendable and no dependencies
- Fully asynchronous code

## Nice side effects
- DRY: Reusable you data types across your stack
- Automatically parameters normalization, validation and interpolation (Optional)
- Security: Confidence about input filtering/validation.
- Unified error codes
- Automatically code documentation




## API

- `sf.set(name, params, code)` Define a new method/function
- `sf.call(name, params)` Call a defined method/function
- `sf.type.set(name, code)` Define a new type rule
- `sf.type.call(name, value, options, cb)` Evaluate/test a type. Useful if you need to use a type outside a smart-function



### INIT
```js
var sf = require('smart-function')({
	methods: {},		// [Optional] You can define all your methods here
	types: {},			// [Optional] You can define all types here
	errors: {},			// [Optional] You can define all error codes here
});
```


---
### TYPES

Types are plain asynchronous JS functions. Your receive data and do the validation/normalization/interpolation/whatever and in the end you can abort the operation (in case the validation fails) or continue and send the final data.

You can define all your types in the initialization, or using the following method:

#### sf.type.set(name, function)

* `name` - The name for the type
* `function(value, options, cb)` - The function responsible for handling this data type
	* `value` - The value to be evaluated
	* `options` - Optional params to the validation (eg: in a minMax validation you can pass the max and min values)
	* `cb` - The callback to call when you have the final decision: `cb.success(finalResult)` or `cb.error(errorCode, [errorMessage])`

***Example***
```js
sf.type.set('yourTypeName', function(value, options, cb) {

	// We make our validation logic here.
	// Since all code is asynchronous, fell free to do what you want 
	// e.g.: wait for database, external API, etc.

	if (value == 'expectedValue')
	{
		// If everything is OK we pass the final data (here we are trimming the value)
		var finalData = value.trim()
		cb.success(finalData)
	}
	else
	{
		// If you want to stop/abort, we pass the error code and a optional error message
		cb.error('100', 'Value is differente from "expectedValue"')
	}

})
```

(Smart-function already ships with 2 default types: float and number, but feel free to overwrite it.)

-

#### sf.type.call(name, value, options, cb)

* `name` - The name of the type to call
* `value` - The value to be evaluated
* `options` - Optional params to the type (eg: in a minMax type you can pass the max and min values)
* `cb(error, result)` - The callback to receive the final decision and data

***Example***
```js
sf.type.call('yourTypeName', 'myValue', function(error, result) {

	if (error) {
		console.log('Ups, this returned a error: '+error);
	} else {
		console.log('Great, no error, the final returned value is: '+result);
	}

})
```

(You will only need this to use your types outside smart-function scope)












---
### METHODS

Methods are your defined plain JS asynchronous functions. 

#### sf.set(name, params, function)

* `name` - The name of the method to set
* `params` - An object of params to use, every param should have:
	* `required` (Boolean) - Is the params required
	* `type` - A name of the type to validate
* `function(params, cb)` - The function containing your code
	* `params` - A object with all the params (already validated, sanitized and interpolated by the type)
	* `cb` - The callback to call when you have the final result: `cb.success(response)` or `cb.error(errorCode, [errorMessage])`

***Example***
```js
sf.set('sum', {
  x: { required: true, type: 'number'},
  y: { required: true, type: 'number'}
}, function(params, cb){
	// All params are already validated, lets do our code:
	var result = params.x + params.y;
	cb.success(result);
});
```

-
#### sf.call(name, params, cb)

* `name` - The name of the method to call
* `params` - An object of params to use
* `cb(error, result)` - The callback to receive the result

***Example***
```js
sf.call('sum', { x: 5, y: 20 }, function(error, result){
	console.log(result);
});
```










## Full example

Lets iterate from the TLDR example:

```js

var sf = require('smart-function')();

// Lets create a new type to validate e-mail
sf.type.set('email', function(value, options, cb) {

  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (re.test(value))
  	cb.success(value);
  else
  	cb.error(100, 'Invalid e-mail');
})

// Lets create a new type to validate and interpolate a user
sf.type.set('user', function(value, options, cb) {

	var user = db_getUserId(value);

  if (user)
  	cb.success(user);
  else
  	cb.error(101, 'Invalid User');
})

//Lets define our method that uses our newly crated types:
sf.set('updateUserEmail', {
	userId: { required: true, type: 'user'},
	newEmail: { required: true, type: 'email'}
}, function(params, cb){
	
	// OK, we FINALLY got everything we need, lets do our code
	db_userUpdate(userId, {email: newEmail}, function(error, data){
		if (error)
			cb.error(error)
		else
			cb.sucess(data)
	})
})

// Lets use our new method
sf.call('updateUserEmail', {userId: 1, newEmail: 'test@example.com'}, function(error, result){
	console.log(error, result);
})

```






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


