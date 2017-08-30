/**
 * http请求工具类
 * Created by wy on 2017/8/30.
 */
    //POST URL
var querystring = require('querystring');
var url = require('url');
var http = require('http');
var https = require('https');
var util = require('util');
var resopnseData = "";

/**
 * http_post请求
 * @param url_str 请求url
 * @param data json类型参数
 * @param callback 回调函数result=1为请求成功，-1为请求失败
 */
exports.http_post = function httpPost(url_str,data,callback){
    //对data和url_str进行处理
    var contentStr = querystring.stringify(data);
    var contentLen = Buffer.byteLength(contentStr, 'utf8');
    var httpModule = url_str.indexOf('https') === 0 ? https : http;
    var urlData = url.parse(url_str);
    //HTTP请求选项
    var opt = {
        hostname: urlData.hostname,
        path: urlData.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': contentLen
        }
    };
    //处理事件回调
    var req = httpModule.request(opt, function(httpRes) {
        var buffers = [];
        httpRes.on('data', function(chunk) {
            buffers.push(chunk);
        });

        httpRes.on('end', function(chunk) {
            //数据返回
            var wholeData = Buffer.concat(buffers);
            var dataStr = wholeData.toString('utf8');
            resopnseData = dataStr;
            callback(1);
        });
    }).on('error', function(err) {
        resopnseData = err;
        callback(-1);
    });
    req.write(contentStr);
    req.end();
}

exports.http_get = function httpGet(url_str,callback) {
    http.get(url_str, function (req, res) {
        var html = '';
        req.on('data', function (data) {
            html += data;
        });
        req.on('end', function () {
            resopnseData = html;
            callback(1);
        });
        req.on('error', function (err) {
            resopnseData = err;
            callback(-1);
        });
    });
}

exports.get_data = function getData(){
    return resopnseData;
}
