var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

function getInfo(callback){ // 获得内容信息
    fs.readFile('./employee.json','utf8',function (err,data){
        var employees = [];
        if(err){
            callback(employees);
        }else{
            if(data.startsWith('[')){
                employees = JSON.parse(data);
            }
            callback(employees);
        }
    });
}
function setInfo(data,callback){// 设置内容信息
    fs.writeFile('./employee.json',JSON.stringify(data),callback);
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'/')));
app.get('/',function (req,res){
    fs.createReadStream('./index.html').pipe(res); // 创建可读流读取index.html文档并且发送文档数据
});
app.get('/employee',function (req,res){// list
    getInfo(function (data){
        res.send(data);
    });
});
app.get('/employee/:id',function (req,res){// detail
    var id= req.params.id;
    getInfo(function (data){
        var employee = data.find(function (item){
            return item.id == id;
        });
        setInfo(data,function (){
            res.send(employee);
        })
    })
});
app.post('/employee',function (req,res){ // add
    var employee = req.body;
    getInfo(function (data){
        employee.id = data.length ? data[data.length - 1].id + 1 : 1;
        data.push(employee);
        setInfo(data,function (){
            res.send(employee);
        })
    })
});
app.listen(8004,function(){
    console.log("http://localhost:8004");
});