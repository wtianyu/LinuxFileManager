/**
 * Created by wy on 2017/4/11.
 */
var process = require("./process.js");
process.exec_process("systeminfo",function(){
    console.log(process.getShellData().stdout);
});