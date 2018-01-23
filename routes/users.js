var express = require('express');
var router = express.Router();
const http_req = require('./../module/http_req.js');
var qs = require('querystring');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/**
 * 人脸识别-人脸检测
 */
router.post('/face_1', function(req, res, next) {
    //允许跨域访问
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type');
    var data = {};
    data.access_token = req.body.access_token;
    data.face_fields = req.body.face_fields;
    data.image = req.body.image;
    var resopnse_data = {};
    http_req.http_post('https://aip.baidubce.com/rest/2.0/face/v1/detect', data, function(result) {
        if (result == 1) {
            var dataStr = http_req.get_data();
            resopnse_data.code = 1;
            resopnse_data.data = dataStr;
            res.end(JSON.stringify(resopnse_data));
        } else {
            resopnse_data.code = -1;
            resopnse_data.data = "服务器异常,请稍后访问!";
            res.end(JSON.stringify(resopnse_data));
        }
    });

});




module.exports = router;