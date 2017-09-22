'use strict';
// var moment = require('moment');
var mongoose =require('mongoose'),
    News=mongoose.model('News');
    var multiparty = require('multiparty');
    var fs = require("fs");
    var dateFormat = require('dateformat');
exports.News=function(req, res){
    News.find({}, function(err, task){
        if(err)
        {
            res.send(err);
        }
        else{
            res.render('news/home',{'news': task,'dateformat':dateFormat});
        }
    });
}
exports.GetNews=function(req, res){
    if (req.params.id == 0) {
        res.render('news/detail', { 'news': null });
    }
    else {
        News.findOne({ _id: req.params.id }, function (err, task) {
            if (err)
                res.send(err);
            else {
                
                res.render('news/detail', { 'news': task });
            }
        });
    }
}
exports.PostNews = function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var item = {}
        item.title = fields.title;
        item.description =fields.description;
        var img = files.images[0];
        item.photo='';
        if (img) {
            let data = fs.readFileSync(img.path);
            let filenam=Date.now()+ img.originalFilename;
            let phyPath = "./public/images/news/" +filenam;
            let realfile = fs.writeFileSync(phyPath, data);
            fs.stat("./public/images/news/"+fields.photo, function (err1, stats){
                if(!err1){
                    let remove = fs.unlinkSync("./public/images/news/"+fields.photo);
                }
            });
            item.photo = filenam;
        }  
        console.log(item.photo);
        if (req.params.id == 0) {
            var news = new News(item);
            news.save(function (err, task) {
                if (err)
                    res.send(err);
                else {
                    res.redirect('../news');
                }
            });
        }
        else{
            News.findByIdAndUpdate(
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
                        res.redirect('../news');
                    }
                });
        }
    });
};
exports.DeleteNews = function (req, res) {
    //var new_task=new Topic(req.body);
    News.remove(
        {
            _id: req.params.id,
        },
        function (err, task) {
            if (err)
                res.send(err);
            res.redirect('../news');
        });
};