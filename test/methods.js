var assert = require("assert")
var sf = require("../smart-function.js")();



describe('Method lifecycle', function(){

    it('Should be empty', function(){
        assert.equal(true, sf.isEmpty(sf.methods));
    })


    it('Add 3 new methods', function(){

        sf.set('sum', {
          x: { required: true, type: 'integer'},
          y: { required: true, type: 'integer'}
        }, function(params, cb){

            console.log('WTF', params);

            // All params are already validated, lets do our code:
            var result = params.x + params.y;
            cb.success(result);
        });

        sf.set('multiply', {
          x: { required: true, type: 'integer'},
          y: { required: true, type: 'integer'}
        }, function(params, cb){
            // All params are already validated, lets do our code:
            var result = params.x * params.y;
            cb.success(result);
        });

        sf.set('divide', {
          x: { required: true, type: 'integer'},
          y: { required: true, type: 'integer'}
        }, function(params, cb){
            // All params are already validated, lets do our code:
            var result = params.x / params.y;
            cb.success(result);
        });

    })



    it('Should not be empty', function(){
        assert.equal(false, sf.isEmpty(sf.methods));
    })


    it('Should have 3 total methods', function(){
        assert.equal(3, Object.keys(sf.methods).length);
    })


/*
    it('Call method', function(){
        sf.call('sum', { x: 5, y: 20 }, function(error, result){
            assert.equal(25, result);
        });
    })
*/

    it('Call method with invalid params', function(){
        sf.call('sum', { x: 'a', y: 20 }, function(error, result){
            assert.equal(-32602, error.code);
        });
    })

    it('Call method with invalid params II', function(){
        sf.call('sum', { x: 11, y: 'ss' }, function(error, result){
            assert.equal(-32602, error.code);
        });
    })

    it('Call method with invalid params (empty object))', function(){
        sf.call('sum', {}, function(error, result){
            assert.equal(-32602, error.code);
        });
    })

    it('Call method with invalid params (string as param)', function(){
        sf.call('sum', 'wtf', function(error, result){
            assert.equal(-32602, error.code);
        });
    })    

    it('Call method with invalid params (null as param)', function(){
        sf.call('sum', null, function(error, result){
            assert.equal(-32602, error.code);
        });
    })

    it('Call method with invalid params (NaN as param)', function(){
        sf.call('sum', NaN, function(error, result){
            assert.equal(-32602, error.code);
        });
    })

    it('Call invalid method name', function(){
        sf.call('methodNotFound', { x: 11, y: 'ss' }, function(error, result){
            assert.equal(-32601, error.code);
        });
    })

})


