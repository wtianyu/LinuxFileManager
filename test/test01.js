/**
 * Created by wy on 2016/8/23.
 * ndir模块
 */
var fs = require("fs");
path ="E:\\NodeJS\\";
fs.readdir(path,function(err, files){
    if (err) {
        return console.error(err);
    }
    files.forEach( function (file){
        // console.log( path+file );
        fs.exists(path+file,function (isexist) {
            if(!isexist){
                console.log("文件不存在");
            }else{
                if(fs.lstatSync(path).isDirectory()){
                    console.log( "我是目录",path+file );
                }else{
                    console.log( "我是文件",path+file );
                }
            }
        })

    });

    // files.forEach(function(file) {
    //     console.log(path + '\\' + file)
    //     fs.stat(path + '/' + file, function (err, stat) {
    //         if (err) {
    //             console.log(err);
    //             return;
    //         }
    //         if (stat.isDirectory()) {
    //             // 如果是文件夹遍历
    //             console.log(path + '/' + file);
    //         } else {
    //             // 读出所有的文件
    //             console.log('文件名:' + path + '/' + file);
    //         }
    //     });
    // });
});