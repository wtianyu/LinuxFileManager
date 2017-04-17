var express = require('express');
var fs = require("fs");
var uploadFile = require("./../module/UploadFile.js");//文件上传模块
var process = require("./../module/process.js");//shell命令执行模块
var router = express.Router();

//TODO html页面优化
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('test', {title: 'Express'});
});

router.get('/wtiy', function (req, res, next) {

    reqIp = getIPAdress() + ":3000";
    console.log("请连接本机ip：",reqIp);
    res.render('indexdir', {dataip: reqIp});
});

//下载文件
router.get('/filedownload', function (req, res, next) {
    var filepath = req.query.path;
    downloadFile(filepath, res, req);
});

//获取系统内存使用情况
router.get('/shellMemCondition', function (req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    process.exec_process("systeminfo",function(){
        res.write(process.getShellData().stdout);
        res.end();
    });
});
//上传文件
router.post('/uploadFile', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    try {
        uploadFile.uploadFile(req, res);
    }catch (e){
        log(e);
        // res.end('<h1>上传失败</h1>' +
        //     '<meta http-equiv=refresh content="3;url=function03">');
        res.end('上传失败，点击确认后刷新');
    }
    res.end('上传成功，点击确认后刷新');
});


//下载列表
router.get('/filelist', function (req, res, next) {
    var filepath = "E:\\";
    var path = req.query["path"];
    console.log(path)
    if (path != null) {
        filepath = path + "\\";
    }
    reqIp = getIPAdress() + ":3000";
    dirlist = getDirList(filepath);
    filelist = getFileList(filepath);
    console.log(filelist);
    console.log(dirlist);

    //处理文件名显示问题
    filenamelist = new Array();
    dirnamelist = new Array();
    for (var i=0;i<filelist.length;i++){
        var temp = filelist[i].split("\\");
        filenamelist[i] = temp[temp.length - 1];
    }

    for (var i=0;i<dirlist.length;i++){
        var temp = dirlist[i].split("\\");
        dirnamelist[i] = temp[temp.length - 1];
    }
    console.log(filenamelist);
    console.log(dirnamelist);
    res.render('index', {dataip: reqIp, filelist: filelist, dirlist: dirlist,dirnamelist:dirnamelist,filenamelist:filenamelist});
});

/**
 * 文件列表获取
 * @param filepath
 * @param res
 */
function getFileList(filepath, res) {
    var i = 0;
    var filelist = new Array();
    console.log(filepath);
    var files = fs.readdirSync(filepath);
    files.forEach(function (file) {
        if (fs.existsSync(filepath + file)) {
            if (fs.lstatSync(filepath + file).isDirectory()) {
                // console.log("我是目录", filepath + file);
            } else {
                filelist[i++] = filepath + file;
                console.log("我是文件", filelist[i - 1]);
            }
        }
    });
    return filelist;
}

/**
 * 文件目录获取
 * @param filepath
 * @param res
 */
function getDirList(filepath, res) {
    var i = 0;
    var dirlist = new Array();
    var files = fs.readdirSync(filepath);
    files.forEach(function (file) {
        if (fs.existsSync(filepath + file)) {
            if (fs.lstatSync(filepath + file).isDirectory()) {
                console.log("我是目录", filepath + file);
                dirlist[i++] = filepath + file;
            } else {
                // console.log("我是文件", filepath + file);
            }
        }
    });

    return dirlist;
}

/**
 * 文件下载
 * @param filepath
 * @param res
 */
function downloadFile(filepath, res, req) {
    var filepathTemp = filepath.split("\\");
    var filename = filepathTemp[filepathTemp.length - 1];
    console.log(filepathTemp);
    res.download(filepath, filename, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Send', filename, 'To:', req.ip, 'Success');
        }
    });
}

/**
 * 获取本机ip地址
 * @returns {*}
 */
function getIPAdress(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}
module.exports = router;
