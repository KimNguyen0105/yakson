'use strict';
var mongoose =require('mongoose'),
    Promotion=mongoose.model('Promotion');
    var multiparty = require('multiparty');
    var fs = require("fs");
exports.Promotion=function(req, res){
    Promotion.find({}, function(err, task){
        if(err)
        {
            res.send(err);
        }
        else{
            res.render('promotion/home',{'promotions': task});
        }
    });
}
exports.GetPromotion=function(req, res){
    if (req.params.id == 0) {
        res.render('promotion/detail', { 'promotion': null });
    }
    else {
        CardType.findOne({ _id: req.params.id }, function (err, task) {
            if (err)
                res.send(err);
            else {
                //console.log(task);
                //var data=JSON.stringify(task);
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
        item.location = fields.benefit;
        item.end_at = parseInt(fields.type);
        var img = files.images[0];
        item.photo='';
        if (img) {
            fs.readFile(img.path, item.photo, function (err, data) {
                var path = "./public/images/promotion/" + img.originalFilename;
                fs.writeFile(path, data, function (error) {
                    if(error){
                        console.log(error);
                    }

                });
            });
            item.photo = img.originalFilename;
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