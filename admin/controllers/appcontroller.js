'use strict';
// var moment = require('moment');
var mongoose =require('mongoose'),
    AppCommon=mongoose.model('AppCommon'),
    User=mongoose.model('User'),
    HistoryUser=mongoose.model('History');
    var multiparty = require('multiparty');
    var fs = require("fs");
    var dateFormat = require('dateformat');
    var bcrypt = require('bcrypt-nodejs');
   
exports.Term=function(req, res){
    AppCommon.findOne({type:0}, function(err, task){
        if(err)
        {
            res.send(err);
        }
        else{
            res.render('app/term',{'term': task});
        }
    });
}

exports.PostTerm = function (req, res) {
        if (req.params.id == 0) {
            var appcommon = new AppCommon(req.body);
            appcommon.save(function (err, task) {
                if (err)
                    res.send(err);
                else {
                    res.redirect('../term');
                }
            });
        }
        else{
            AppCommon.findByIdAndUpdate(
                {
                    _id: req.params.id,
                },
                req.body
                , {
                    new: true
                }
                , function (err, task) {
                    if (err)
                        res.send(err);
                    else {
                        res.redirect('../term');
                    }
                });
        }
};
exports.AboutCompany=function(req, res){
    AppCommon.findOne({type:1}, function(err, task){
        if(err)
        {
            res.send(err);
        }
        else{
            res.render('app/about_company',{'about': task});
        }
    });
}

exports.PostAboutCompany = function (req, res) {
        var item={};
        item.title=req.body.title;
        item.description=req.body.description;
        item.type=1;
        
        if (req.params.id == 0) {
            var appcommon = new AppCommon(item);
            appcommon.save(function (err, task) {
                if (err)
                    res.send(err);
                else {
                    res.redirect('../about-company');
                }
            });
        }
        else{
            AppCommon.findByIdAndUpdate(
                {
                    _id: req.params.id,
                },
                item
                , {
                    new: true
                }
                , function (err, task) {
                    if (err)
                        res.send(err);
                    else {
                        res.redirect('../about-company');
                    }
                });
        }
};
exports.AboutApp=function(req, res){
    AppCommon.findOne({type:2}, function(err, task){
        if(err)
        {
            res.send(err);
        }
        else{
            res.render('app/about_app',{'about': task});
        }
    });
}

exports.PostAboutApp = function (req, res) {
        var item={};
        item.title=req.body.title;
        item.description=req.body.description;
        item.type=2;
        
        if (req.params.id == 0) {
            var appcommon = new AppCommon(item);
            appcommon.save(function (err, task) {
                if (err)
                    res.send(err);
                else {
                    res.redirect('../about-app');
                }
            });
        }
        else{
            AppCommon.findByIdAndUpdate(
                {
                    _id: req.params.id,
                },
                item
                , {
                    new: true
                }
                , function (err, task) {
                    if (err)
                        res.send(err);
                    else {
                        res.redirect('../about-app');
                    }
                });
        }
};
//user app
exports.UserApp=function(req, res){
    User.find({}, function(err, task){
        if(err)
        {
            res.send(err);
        }
        else{
            res.render('app/user',{'users': task});
        }
    });
}
exports.GetUserApp=function(req, res){
        res.render('app/user_new', { 'user': null });
}
exports.GetDetailUserApp=function(req, res){
        User.findOne({ _id: req.params.id }, function (err, task) {
            if (err)
                res.redirect('../user-app');
            else {
                
                res.render('app/user_detail', { 'user': task,'dateformat':dateFormat });
            }
        });
}
var email=function(email) {
    return User.findOne({email:email})
}
exports.PostNewUserApp = function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var item = {}
        item.fullname = fields.fullname;
        item.email =fields.email;
        item.phone = fields.phone;
        item.gender =parseInt(fields.gender);
        item.birthday = dateFormat(fields.birthday, 'dd/mm/yyyy h:MM TT');
        item.address =fields.address;
        item.cardId =1;
        item.allowNotification =fields.allowNotification;
        item.role =1;
        item.password=bcrypt.hashSync(fields.password, bcrypt.genSaltSync(5), null);
       
        var img = files.images[0];
        item.avatar='';
        if (img) {
            let data = fs.readFileSync(img.path);
            let filenam=Date.now()+ img.originalFilename;
            let phyPath = "./public/images/user/" +filenam;
            let realfile = fs.writeFileSync(phyPath, data);
            item.avatar = filenam;
        }  
       
        var user = new User(item);
        user.save(function (err, task) {
            if (err)
                res.send(err);
            else {
                res.redirect('user-app');
            }
        });
       
    });
};
exports.PostUpdateUserApp = function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var item = {}
        item.fullname = fields.fullname;
        item.phone = fields.phone;
        item.gender =parseInt(fields.gender);
        item.birthday = dateFormat(fields.birthday, 'dd/mm/yyyy h:MM TT');
        item.address =fields.address;
        item.cardId =1;
        item.allowNotification =fields.allowNotification;
        item.role =1;
        item.password=bcrypt.hashSync(fields.password, bcrypt.genSaltSync(5), null);
        var img = files.images[0];
        item.avatar='';
        if (img) {
            let data = fs.readFileSync(img.path);
                let filenam=Date.now()+ img.originalFilename;
                let phyPath = "./public/images/user/" +filenam;
                let realfile = fs.writeFileSync(phyPath, data);
                fs.statSync("./public/images/user/"+fields.avatar, function (err1, stats){
                    if(!err1){
                        let remove = fs.unlinkSync("./public/images/user/"+fields.avatar);
                    }
                });
                item.avatar = filenam;
            }
        User.findByIdAndUpdate(
            {
                _id: req.params.id,
            },
            item
            , {
                new: true
            }
            , function (err, task) {
                if (err)
                    res.send(err);
                else {
                    res.redirect('../user-app');
                }
            });
       
    });
};
exports.DeleteUserApp = function (req, res) {
    //var new_task=new Topic(req.body);
    User.remove(
        {
            _id: req.params.id,
        },
        function (err, task) {
            if (err)
                res.send(err);
            res.redirect('../user-app');
        });
};
exports.UpdatePassUserApp = function (req, res) {
    //var new_task=new Topic(req.body);
    var user = User.findOne({ _id: req.params.id }, function (err, task) {
        return task;
    });

};
//lịch sử giao tác
exports.History=function(req, res){
    HistoryUser.find({owner_id:req.params.id}, function(err, task){
        if(err)
        {
            res.send(err);
        }
        else{
            res.render('app/about_app',{'about': task});
        }
    });
}
