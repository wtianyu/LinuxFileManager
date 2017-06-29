var express = require('express');
var fs = require("fs");
var uploadFile = require("./../module/UploadFile.js"); //文件上传模块
var process = require("./../module/process.js"); //shell命令执行模块
var log = require("./../module/log.js"); //shell命令执行模块
var router = express.Router();
const basePath = "/home/node/project/ExpressFileManager";

//TODO html页面优化
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('test', { title: 'Express' });
});

router.get('/wtiy', function(req, res, next) {
    reqIp = getIPAdress() + ":3010";
    console.log("请连接本机ip：", reqIp);
    res.render('indexdir', { dataip: reqIp });
});

//下载文件
router.get('/filedownload', function(req, res, next) {
    saveLog(req);
    var filepath = req.query.path;
    downloadFile(filepath, res, req);
});

//预览文件
router.get('/fileView', function(req, res, next) {
    saveLog(req);
    // res.charset = 'utf-8';
    res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
    var filepath = req.query.path;
    var data = fs.readFileSync(filepath, 'utf8');
    console.log(data.length);
    if (data.length > 1024 * 1024 * 10) {
        res.write("文件数据过大,请下载后进行查看");
    } else {
        res.write(data);
    }
    res.end();
    // rs = fs.createReadStream(filepath, 'utf-8');
    // try {
    //     // rs.on('data', function(chunk) {
    //     //     console.log(chunk);
    //     //     res.write(chunk);
    //     //     res.end();
    //     // });
    // } catch (e) {
    //     console.log("error");
    // }
});

//获取子节点目录
router.get('/getFolderNodes', function(req, res, next) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var filepath = req.query.path;
    console.log("获取子节点目录" + filepath);
    var showNodes = "[";
    showNodes += arrayToZtreeJson(getDirList(filepath + "/"));
    if (showNodes.length > 1) {
        showNodes = showNodes.substring(0, showNodes.length - 1) + "]";
    } else {
        showNodes += "]";
    }
    console.log(showNodes);
    res.write(showNodes);
    res.end();
});

//获取所有的文件目录;用于显示树形目录
router.get('/getFolderAll', function(req, res, next) {
    saveLog(req);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var showFoder = "[";
    var filepath = req.query.path;
    filepath = replaceAll(filepath, "//", "/");
    filepath = "/" + filepath;
    console.log(filepath);
    if (filepath != null) {
        filepath = filepath + "/";
        //通过filepath分离路径;比如/home/wa/haha将会分解成/home,/home/wa,/home/wa/haha
        var filepathArray = getDirByPath(filepath);
        console.log(filepathArray);
        for (var j = 0; j < filepathArray.length; j++) {
            showFoder += arrayToZtreeJson(getDirList(filepathArray[j]))
        }
        showFoder = showFoder.substring(0, showFoder.length - 1);
    }
    showFoder += "]";
    console.log(showFoder);
    res.write(showFoder);
    res.end();
});

function getDirByPath(path) {
    var pathArray = new Array();
    var count = 0;
    var beginPath = 0;
    if (path == null || path == "") {
        return new Array();
    }
    do {
        beginPath = path.indexOf("/", beginPath + 1);
        if (beginPath == -1) {
            break;
        } else {
            pathArray[count++] = replaceAll(path.substring(0, beginPath) + "/", "//", "/");
        }
    } while (path.indexOf("/", beginPath) > -1);

    return pathArray;
}

function arrayToZtreeJson(array) {
    console.log("array");
    console.log(array);
    var json = "";
    for (var i = 0; i < array.length; i++) {
        json += '{"id":"' + array[i] + '","name":"' + getRealNameByPath(array[i]) + '","pId":"' + getPrePathByPath(array[i]) + '","isParent":"true"},';
    }
    return json;
}

function getPrePathByPath(path) {
    var realNameArray = path.split("/");
    if (realNameArray.length > 2) {
        return path.substring(0, path.lastIndexOf("/"));
    } else {
        return "/";
    }
}

function getRealNameByPath(path) {
    var realNameArray = path.split("/");
    return realNameArray[realNameArray.length - 1];
}


//执行复制，移动，或者删除命令
router.get('/shellOperate', function(req, res, next) {
    saveLog(req);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var doType = req.query["doType"]
    var sourcePath = req.query["sourcePath"];
    var targetPath = req.query["targetPath"];
    var shell = "";
    var message = "";
    console.log(doType);
    switch (doType) {
        case "1": //删除操作
            if (fs.existsSync(sourcePath)) {
                shell = "rm -rf \"" + sourcePath + "\"";
            } else {
                message = "删除该目录异常"
            };
            break;
        case "2": //移动操作
            shell = "mv \"" + sourcePath + "\"" + "  \"" + targetPath + "\"";
            break;
        case "3": //复制操作
            shell = "cp -f -r \"" + sourcePath + "\"" + "  \"" + targetPath + "\"";
            break;
        case "4": //重命名文件
            shell = "mv \"" + sourcePath + "\"" + "  \"" + targetPath + "\"";
            break;
        case "5": //新建文件
            shell = "touch \"" + targetPath + "\"";
            break;
        case "6": //新建文件夹
            shell = "mkdir \"" + targetPath + "\"";
            break;
        case "7": //zip解压
            shell = "unzip -o -q \"" + sourcePath + "\"" + " -d \"" + sourcePath.substring(0, sourcePath.length - 4) + "\"";
            break;
        case "8": //zip压缩
            shell = "zip -q -r \"" + sourcePath + ".zip\" \"" + sourcePath + "\"";
            break;
    }
    if (shell.length > 0) {
        console.log("shell:" + shell);
        process.exec_process(shell, function() {
            if (process.getShellData().err == null) {
                res.write("操作成功");
            } else {
                console.log(process.getShellData().stderr)
                res.write("执行指令出错");
            }
            res.end();
        });
    } else {
        res.write("请求指令出错");
        res.end();
    }
});

//获取系统内存使用情况
router.get('/shellMemCondition', function(req, res, next) {
    saveLog(req);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    process.exec_process("df", function() {
        var data = process.getShellData();
        if (data.err == null) {
            res.write(process.getShellData().stdout);
        } else {
            res.write(process.getShellData().stderr);
        }
        res.end();
    });
});

//文件搜索功能
router.post('/searchFile', function(req, res, next) {
    saveLog(req);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var searchFile = req.body.searchFile;
    var searchRange = req.body.searchRange;
    var searchNameIP = req.body.searchNameIP;
    var searchNameTT = req.body.searchNameTT;
    var sourcePath = req.body.sourcePath;
    searchNameIP = replaceAll(searchNameIP, " ", "\\ ");
    searchNameTT = replaceAll(searchNameTT, " ", "\\ ");
    var code = "";
    if (searchFile == 1) { //根据文件名搜索
        if (searchRange == 1) { //全局搜素
            code = "find / -name " + searchNameIP;
        } else { //当前文件目录下搜素
            code = "find " + sourcePath + " -name " + searchNameIP;
        }
    } else { //根据文件内容搜索grep -r -l 'post' /home/node/project/
        if (searchRange == 1) { //全局搜素
            code = "grep -r -l " + searchNameTT + " /";
        } else { //当前文件目录下搜素
            code = "grep -r -l " + searchNameTT + " " + sourcePath;
        }
    }
    console.log(code);
    process.exec_process(code, function() {
        var data = process.getShellData();
        if (data.err == null) {
            res.write(process.getShellData().stdout);
        } else {
            res.write(process.getShellData().stderr);
        }
        res.end();
    });
});

//上传文件
router.post('/uploadFile', function(req, res) {
    saveLog(req);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    try {
        uploadFile.uploadFile(req, res);
    } catch (e) {
        log(e);
        // res.end('<h1>上传失败</h1>' +
        //     '<meta http-equiv=refresh content="3;url=function03">');
        res.end('上传失败，点击确认后刷新');
    }
    res.end('上传成功，点击确认后刷新');
});



//下载列表
router.get('/filelist', function(req, res, next) {
    saveLog(req);
    var filepath = "/";
    var path = req.query["path"];
    console.log(path)
    if (path != null && path.length > 1) {
        filepath = path + "/";
    }
    reqIp = getIPAdress() + ":3010";
    dirlist = getDirList(filepath);
    filelist = getFileList(filepath);
    console.log("fileList:" + filelist);
    console.log("dirlist:" + dirlist);

    //处理文件名显示问题
    filenamelist = new Array();
    dirnamelist = new Array();
    for (var i = 0; i < filelist.length; i++) {
        var temp = filelist[i].split("/");
        filenamelist[i] = temp[temp.length - 1];
    }

    for (var i = 0; i < dirlist.length; i++) {
        var temp = dirlist[i].split("/");
        dirnamelist[i] = temp[temp.length - 1];
    }
    console.log(filenamelist);
    console.log(dirnamelist);
    res.render('index', { dataip: reqIp, filelist: filelist, dirlist: dirlist, dirnamelist: dirnamelist, filenamelist: filenamelist });
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
    files.forEach(function(file) {
        if (fs.existsSync(filepath + file)) {
            if (fs.lstatSync(filepath + file).isDirectory()) {
                console.log("我是目录", filepath + file);
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
    files.forEach(function(file) {
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
    var filepathTemp = filepath.split("/");
    var filename = filepathTemp[filepathTemp.length - 1];
    console.log(filepathTemp);
    res.download(filepath, filename, function(err) {
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
function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

/**
 * 完美实现字符全部替换功能
 * @param str 原完整字符串
 * @param sptr1 原字符
 * @param sptr2 替换字符
 * @returns {string} 替换后的字符串
 */
function replaceAll(str, sptr1, sptr2) {
    var strTemp = "";
    var flag = 0;
    var length = 0;
    var begin = 0;
    if (str.indexOf(sptr1, flag + length) == -1) {
        return str;
    }
    while ((flag = str.indexOf(sptr1, flag + length)) > -1) {
        strTemp += str.substring(begin, flag) + sptr2;
        length = sptr2.length;
        begin = flag + sptr1.length;
    }
    if (length != 0) { //进行过截断
        strTemp += str.substring(begin, str.length);
    }
    return strTemp;
}

function getDate() {
    var date = new Date();
    var time = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    return time;
}

function saveLog(req) {
    log.saveLog("123.1.151.52", 3010, req, basePath + "/Log/" + getDate() + "/", "http_node_file.log");
}

module.exports = router;