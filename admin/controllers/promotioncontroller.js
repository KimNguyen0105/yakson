'use strict';
// var moment = require('moment');
var mongoose =require('mongoose'),
    Promotion=mongoose.model('Promotion');
    var multiparty = require('multiparty');
    var fs = require("fs");
    var dateFormat = require('dateformat');
exports.Promotion=function(req, res){
    Promotion.find({}, function(err, task){
        if(err)
        {
            res.send(err);
        }
        else{
            var mang2 = task.map(e => dateFormat(e.end_at, 'dd/mm/yyyy h:MM TT'))
            // console.log(mang2);
            //task.end_at = mang2;
            res.render('promotion/home',{'promotions': task,'dateformat':dateFormat});
        }
    });
}
exports.GetPromotion=function(req, res){
    if (req.params.id == 0) {
        res.render('promotion/detail', { 'promotion': null });
    }
    else {
        Promotion.findOne({ _id: req.params.id }, function (err, task) {
            if (err)
                res.send(err);
            else {
                //console.log(task);
                //var data=JSON.stringify(task);
                var date=dateFormat(task.end_at, 'dd/mm/yyyy h:MM TT');
                console.log(date);
                res.render('promotion/detail', { 'promotion': task });
            }
        });
    }
}
exports.PostPromotion = function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var item = {}
        item.title = fields.title;
        item.description =fields.description;
        item.location = fields.location;
        item.end_at = fields.end_at;
        var img = files.images[0];
        item.photo='';
        if (img) {
            let data = fs.readFileSync(img.path);
            let filenam=Date.now()+ img.originalFilename;
            let phyPath = "./public/images/promotion/" +filenam;
            let realfile = fs.writeFileSync(phyPath, data);
            fs.stat("./public/images/promotion/"+fields.photo, function (err, stats){
                if(!err){
                    let remove = fs.unlinkSync("./public/images/promotion/"+fields.photo);
                }
            });
            item.photo = filenam;
        }  
        console.log(item.photo);
        if (req.params.id == 0) {
            var promotion = new Promotion(item);
            promotion.save(function (err, task) {
                if (err)
                    res.send(err);
                else {
                    res.redirect('../promotion');
                }
            });
        }
        else{
            Promotion.findByIdAndUpdate(
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
                        res.redirect('../promotion');
                    }
                });
        }
    });
};
exports.DeletePromotion = function (req, res) {
    //var new_task=new Topic(req.body);
    Promotion.remove(
        {
            _id: req.params.id,
        },
        function (err, task) {
            if (err)
                res.send(err);
            res.redirect('../promotion');
        });
};