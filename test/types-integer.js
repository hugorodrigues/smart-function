var assert = require("assert")
var sf = require("../smart-function.js")();

describe('type.integer', function(){

    var testCase = [
        { error: true, input: 'a'},
        { error: true, input: '1'},
        { error: true, input: '1a'},
        { error: true, input: 'a1'},
        { error: true, input: 1.3},

        { error: null, input: 0},
        { error: null, input: 1},
        { error: null, input: -1},
        { error: null, input: 1000}
    ]

    for (var test in testCase)
    {
        it('The input "'+testCase[test].input+'" should return "'+testCase[test].error+'"', function(){

            var that = this;

            sf.type.integer(this.input, null, function(error, value){
                assert.equal(that.error, error);
            })

        }.bind(testCase[test]))
    }

})