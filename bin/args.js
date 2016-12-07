/*
 * Created by hzwangfei3 on 2016/12/5.
 */
const parseArgv = require('minimist');
const Type = require('../lib/typeOf');

var args = parseArgv(process.argv.slice(2));
function trimAndDelQutoChar(str){
    return typeof str !== "string" ? str : str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'').replace(/'|"/g,"");
}

function travel(obj){
    for(var i in obj){
        if(Type.isSpreadable(obj[i])){
            travel(obj[i])
        }else{
            if(Type.isString(obj[i])){
                obj[i] = trimAndDelQutoChar(obj[i]);
            }
        }
    }
}

travel(args);

module.exports = args;