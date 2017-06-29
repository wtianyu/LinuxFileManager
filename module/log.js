const fs = require('fs');
var hostname;
var port;
exports.saveLog = function(hostnameTemp,portTemp,req, filePath, logName) {
	hostname = hostnameTemp;
	port = portTemp;
    if (fs.existsSync(filePath)) {
        saveLogContent(filePath + logName, req);
    } else {
        //新建目录文件
        fs.mkdirSync(filePath)
        saveLogContent(filePath + logName, req);
    };
}

function saveLogContent(filePath, req) {
    var writeStream = fs.createWriteStream(filePath, { flags: 'a+' })
        //console.log(req);
    var content = "[" + new Date().toLocaleString() + "] ";
    content += "[" + getClientIp(req) + "] ";
    content += "[" + req.method + "] ";
    content += "[http://" + hostname + ":" + port + "" + decodeURIComponent(req.url) + "] ";
    content += "[" + req.headers['user-agent'] + "]";
    writeStream.write(content);
    writeStream.write("\r\n");
}

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};