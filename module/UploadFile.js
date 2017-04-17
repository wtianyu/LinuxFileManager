/**
 * Created by wy on 2016/9/9.
 */
var formidable = require("formidable");
var fs = require("fs");
var iconv = require('iconv-lite');

function uploadFile(req,res) {

    var form = new formidable.IncomingForm();   //创建上传表单
    // form.encoding = 'utf-8';		//设置编辑
    //form.uploadDir =  "D:/123/";	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    // form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {
        console.log(fields.dirpath);
        form.uploadDir = replaceAll(fields.dirpath,"\\\\","/");
        fields.dirpath = replaceAll(fields.dirpath,"%5C","\\");
        form.uploadDir = replaceAll(fields.dirpath,"\\","/");
        form.uploadDir = replaceAll(fields.dirpath,"%2F","");

        if (err) {
            res.locals.error = err;
            res.render('index', { title: TITLE });
            return;
        }

        //重命名
        var random3 = Math.floor(Math.random () * 900) + 100;
        var uploadtime = new Date().getTime();
        console.log("11"+files.uploadFile.path+"22");
        //form.uploadDir = "D:/123";
        var realPath = form.uploadDir+"/"+fields.fileName;
        console.log(realPath);
        //跨区重命名出错
        //fs.renameSync(files.uploadFile.path,realPath);  //重命名
        //0.6以下版本
        // var readStream = fs.createReadStream(files.uploadFile.path)
        // var writeStream = fs.createWriteStream(realPath);
        // util.pump(readStream, writeStream, function() {
        //     fs.unlinkSync(files.uploadFile.path);
        // });
        var readStream=fs.createReadStream(files.uploadFile.path);
        var writeStream=fs.createWriteStream(realPath);
        readStream.pipe(writeStream);
        readStream.on('end',function(){
            fs.unlinkSync(files.uploadFile.path);
        })
    });
    res.locals.success = '上传成功';
    console.log("上传成功");
}

function replaceAll(str, sptr1, sptr2){
    var flag = 0;
    while ((flag = str.indexOf(sptr1,flag)) > 0){
        str = str.replace(sptr1, sptr2);
    }
    return str;
}
exports.uploadFile = uploadFile;