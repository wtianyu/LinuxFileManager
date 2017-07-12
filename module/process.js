var child_process = require('child_process');
var iconv = require('iconv-lite');
var encoding = 'utf-8';//'cp936';
var binaryEncoding = 'binary';
var shellData;
var callBack = function(){};
exports.exec_process = function(code,callBack){
    var data = {};
    child_process.exec(code,{ encoding: binaryEncoding }, function(err, stdout, stderr){
        data.err = err;
        data.stdout = processEncode(stdout);
        data.stderr = processEncode(stderr);
        setShellData(data);
        callBack();
    });
};

function setShellData(data){
    shellData = data;
}

exports.getShellData = function getShellData(){
    return shellData;
}

function processEncode(data){
    return iconv.decode(new Buffer(data, binaryEncoding), encoding);
}


//调用方式
// var process = require("./process.js");
// process.exec_process("ipconfig",function(){
//     console.log(process.getShellData());
// });