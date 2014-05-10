var assert = require("assert")
var sf = require("../smart-function.js")();



describe('Types lifecycle', function(){

    it('Defaults loaded', function(){
        assert.equal(false, sf.isEmpty(sf.types));
    })

    it('Should have 3 total methods', function(){
        assert.equal(3, Object.keys(sf.types).length);
    })

    it('Add 3 new types', function(){
        sf.type.set('demo1', function(value, options, cb) {
            cb.success(value)
        })

        sf.type.set('demo2', function(value, options, cb) {
            cb.success(value)
        })

        sf.type.set('demo3', function(value, options, cb) {
            cb.success(value)
        })
    })

    it('Should have 6 total methods', function(){
        assert.equal(6, Object.keys(sf.types).length);
    })    

})


