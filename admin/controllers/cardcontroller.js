'use strict';
var mongoose =require('mongoose'),
    CardType=mongoose.model('CardType');

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
    var item = {}
    item.title = req.body.title;
    item.description = req.body.description;
    item.sort_order = req.body.sort_order;
    if (req.body.id == 0) {
        var process = new Process(item);
        process.save(function (err, task) {
            if (err)
                res.send(err);
            else {
                res.redirect('../admin/process');
            }
        });
    }
    else {
        Process.findByIdAndUpdate(
            {
                _id: req.body.id,
            },
            item
            , {
                new: true
            }
            , function (err, task) {
                if (err)
                    res.send(err);
                else {
                    res.redirect('../admin/process');
                }
            });
    }
};