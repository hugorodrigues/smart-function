var assert = require("assert")
var sf = require("../smart-function.js")();

describe('Included Types: integer', function(){

    // Invalid test case
    var testCase = [
        { input: 'a'},
        { input: '1'},
        { input: '1a'},
        { input: 'a1'},
        { input: 1.3},
    ]

    for (var test in testCase)
    {
        it('The input "'+testCase[test].input+'" should be Invalid', function(){

            var that = this;

            sf.type.call('integer', this.input, null, function(error, value){
                assert.notEqual(null, error);
            })

        }.bind(testCase[test]))
    }


    // Valid test case
    var testCase = [
        { input: 0 },
        { input: 1 },
        { input: -1 },
        { input: 1000}
    ]

    for (var test in testCase)
    {
        it('The input "'+testCase[test].input+'" should be Invalid', function(){

            var that = this;

            sf.type.call('integer', this.input, null, function(error, value){
                assert.equal(null, error);
            })

        }.bind(testCase[test]))
    }

})