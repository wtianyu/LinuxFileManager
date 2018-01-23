const fs = require('fs');
const http_req = require('./http_req.js');
var hostname;
var port;
var iplocation;
exports.saveLog = function(hostnameTemp, portTemp, req, filePath, logName) {
    hostname = hostnameTemp;
    port = portTemp;
    if (fs.existsSync(filePath)) {
        // saveLogContent(filePath + logName, req);
        getClientLocation(getClientIp(req), function() { saveLogContent(filePath + logName, req) });
    } else {
        //新建目录文件
        fs.mkdirSync(filePath)
            //saveLogContent(filePath + logName, req);
        getClientLocation(getClientIp(req), function() { saveLogContent(filePath + logName, req) });
    };
}

function saveLogContent(filePath, req) {
    var writeStream = fs.createWriteStream(filePath, { flags: 'a+' })
        //console.log(req);
    var content = "[" + new Date().toLocaleString() + "] ";
    content += "[" + getClientIp(req) + "] ";
    content += "[" + iplocation + "] ";
    content += "[" + req.method + "] ";
    try{
    	content += "[http://" + hostname + ":" + port + "" + decodeURIComponent(req.url) + "] ";
    }catch (e){
    	content += "[http://" + hostname + ":" + port + "" + req.url+ "(违法请求url)] ";
        }
    content += "[" + req.headers['user-agent'] + "]";
    console.log("日志已保存")
    writeStream.write(content);
    writeStream.write("\r\n");
}

function getClientLocation(ip, callback) {
    ip = replaceAll(ip, ":", "");
    ip = replaceAll(ip, "f", "");
    http_req.http_get('http://restapi.amap.com/v3/ip?ip=' + ip + '&output=json&key=e88881580a211e0cd138b09d9795f00e', function(result) {
        if (result == 1) {
            var dataStr = http_req.get_data();
            var data = JSON.parse(dataStr);
            if (data.status == 0) {
                iplocation = "ip地址查询失败";
            } else {
                iplocation = data.province + ":" + data.city;
            }
        } else {
            iplocation = "ip地址查询失败@服务器问题@" + http_req.get_data();
        }
        callback();
    });
}

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

/**
 * 完美实现字符全部替换功能
 * @param str 原完整字符串
 * @param sptr1 原字符
 * @param sptr2 替换字符
 * @returns {string} 替换后的字符串
 * 更新时间2017-8-2
 */
function replaceAll(str, sptr1, sptr2) {
    var strTemp = "";
    var flag = 0;
    var length = 0;
    var begin = 0;
    if (str.indexOf(sptr1, flag + length) == -1) {
        return str;
    }
    while ((flag = str.indexOf(sptr1, flag)) > -1) {
        strTemp += str.substring(begin, flag) + sptr2;
        length = sptr2.length;
        begin = flag + sptr1.length;
        flag = flag + sptr1.length;
    }
    if (begin != 0) { //进行过截断
        strTemp += str.substring(begin, str.length);
    }
    return strTemp;
}