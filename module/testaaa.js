/**
 * Created by wy on 2017/4/11.
 */
var func1 = function(req,res,callback){
    setTimeout(function(){
        console.log('in func1');
        //callback(req,res,1);
    },3000);
}
var func2 = function(req,res,callback){
    setTimeout(function(){
        console.log('in func2');
        //callback(req,res,2);
    },2000);
}
var func3 = function(req,res,callback){
    setTimeout(function(){
        console.log('in func3');
        //callback(req,res,3);
    },1000);
}

var req = null;
var res = null;
func1(req,res,function(){
    func2(req,res,function(){
        func3(req,res,function(){
            process.exit(0);
        })
    });
});