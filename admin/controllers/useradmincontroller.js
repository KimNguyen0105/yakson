'use strict';
var mongooes = require('mongoose'),
    UserAdmin = mongooes.model('UserAdmin');
    var sess = {
        secret: 'hbbsolutions',
        cookie: {}
      }
//var slug=require('slugify');
exports.Login = function (req, res) {
     res.render('login'); 
};
exports.PostLogin = function (req, res) {
     UserAdmin.findOne({username: req.body.username},function(err, data){
        if (err){
            res.send(err);
        }
        else{
            var password=data.password;
            if(req.body.password==password)
            { 
                //sess.session.name=data.username;
                //var sess=req.session;
                //var username=data.username;
                req.session.name=data.username;
                res.render('home');
        
            }
            else{
                console.log('Tạch r :)');
            }
        }
     })
};
//home user admin
exports.Home = function (req, res) {
    UserAdmin.find({}, function (err, data) {
        if (err){
            res.send(err);
        }   
        else{
            res.render('user-admin/home',{'users':data});  
        }
    });
};


//them user
exports.Create = function (req, res) {
    var new_task = new UserAdmin(req.body);
    new_task.save(function (err, task) {
        if (err)
            res.send(err);
        res.status(200).send(JSON.stringify({
            success: true,
            data: task,
            errorCode: '',
        }));
    });
};
