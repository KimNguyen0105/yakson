'use strict';
var mongoose =require('mongoose'),
    CardType=mongoose.model('CardType');
    var multiparty = require('multiparty');
    var fs = require("fs");
exports.CardType=function(req, res){
    
    CardType.find({}, function(err, task){
        if(err)
        {
            res.send(err);
        }
        else{
            res.render('card/cardtype',{'cardType': task});
        }
    });
}
exports.GetCardType=function(req, res){
    if (req.params.id == 0) {
        res.render('card/cardtype_detail', { 'cardType': null });
    }
    else {
        CardType.findOne({ _id: req.params.id }, function (err, task) {
            if (err)
                res.send(err);
            else {
                //console.log(task);
                //var data=JSON.stringify(task);
                res.render('card/cardtype_detail', { 'cardType': task });
            }
        });
    }
}
exports.PostCardType = function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var item = {}
        item.title = fields.title;
        item.description =fields.description;
        item.benefit = fields.benefit;
        item.type = parseInt(fields.type);
        item.is_default = fields.is_default;
        item.cashTarget =  parseInt(fields.cashTarget);
        var img = files.images[0];
        item.photo='';
        if (img) {
            fs.readFile(img.path, item.photo, function (err, data) {
                var path = "./public/images/cardtype/" + img.originalFilename;
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
            var cardType = new CardType(item);
            cardType.save(function (err, task) {
                if (err)
                    res.send(err);
                else {
                    res.redirect('../card-type');
                }
            });
        }
        else{
            CardType.findByIdAndUpdate(
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
                        res.redirect('../card-type');
                    }
                });
        }
    });
};
exports.DeleteCardType = function (req, res) {
    //var new_task=new Topic(req.body);
    CardType.remove(
        {
            _id: req.params.id,
        },
        function (err, task) {
            if (err)
                res.send(err);
            res.redirect('../card-type');
        });
};


