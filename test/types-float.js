var assert = require("assert")
var sf = require("../smart-function.js")();

describe('type.float', function(){

    var testCase = [
        { error:true, input: 'a'},
        { error:true, input: '1a'},
        { error:true, input: 'a1'},

        { error:null, input: '1'},
        { error:null, input: 1},
        { error:null, input: -1},
        { error:null, input: 1.3},
        { error:null, input: 0.10},
        { error:null, input: 1.4},
        { error:null, input: -1.3}
    ]

    for (var test in testCase)
    {
        it('The input "'+testCase[test].input+'" should return "'+testCase[test].error+'"', function(){

            var that = this;

            sf.type.float(this.input, null, function(error, value){
                assert.equal(that.error, error);
            })

        }.bind(testCase[test]))
    }

})