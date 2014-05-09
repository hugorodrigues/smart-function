var assert = require("assert")
var sf = require("../smart-function.js")();

describe('type.float', function(){

    var testCase = [
        {expectedResult:false, input: 'a'},
        {expectedResult:false, input: '1a'},
        {expectedResult:false, input: 'a1'},

        {expectedResult:true, input: '1'},
        {expectedResult:true, input: 1},
        {expectedResult:true, input: -1},

        {expectedResult:true, input: 1.3},
        {expectedResult:true, input: 0.10},
        {expectedResult:true, input: 1.4},
        {expectedResult:true, input: -1.3}
    ]

    for (var test in testCase)
        it('The input "'+testCase[test].input+'" should return "'+testCase[test].expectedResult+'"', function(){
            assert.equal(this.expectedResult, sf.type.float(this.input));
        }.bind(testCase[test]))

})