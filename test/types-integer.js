var assert = require("assert")
var sf = require("../smart-function.js")();

describe('type.integer', function(){

    var testCase = [
        {expectedResult:false, input: 'a'},
        {expectedResult:false, input: '1'},
        {expectedResult:false, input: '1a'},
        {expectedResult:false, input: 'a1'},
        {expectedResult:false, input: 1.3},

        {expectedResult:true, input: 0},
        {expectedResult:true, input: 1},
        {expectedResult:true, input: -1},
        {expectedResult:true, input: 1000}
    ]

    for (var test in testCase)
        it('The input "'+testCase[test].input+'" should return "'+testCase[test].expectedResult+'"', function(){
            assert.equal(this.expectedResult, sf.type.integer(this.input));
        }.bind(testCase[test]))

})