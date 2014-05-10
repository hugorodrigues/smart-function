var assert = require("assert")
var sf = require("../smart-function.js")();

describe('Included Types: float', function(){

    // Invalid test case
    var testCase = [
        { input: 'a'},
        { input: '1a'},
        { input: 'a1'},
    ]

    for (var test in testCase)
    {
        it('The input "'+testCase[test].input+'" should be Invalid', function(){

            var that = this;

            sf.type.call('float', this.input, null, function(error, value){
                assert.notEqual(null, error);
            })

        }.bind(testCase[test]))
    }


    // Valid test case
    var testCase = [
        { input: '1'},
        { input: 1},
        { input: -1},
        { input: 1.3},
        { input: 0.10},
        { input: 1.4},
        { input: -1.3}
    ]

    for (var test in testCase)
    {
        it('The input "'+testCase[test].input+'" should be Valid', function(){

            var that = this;

            sf.type.call('float', this.input, null, function(error, value){
                assert.equal(null, error);
            })

        }.bind(testCase[test]))
    }

})