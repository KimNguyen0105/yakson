'use strict';
// var moment = require('moment');
var mongoose =require('mongoose'),
Location=mongoose.model('Location');
    var multiparty = require('multiparty');
    var fs = require("fs");
    var dateFormat = require('dateformat');
exports.Location=function(req, res){
    Location.find({}, function(err, task){
        if(err)
        {
            res.send(err);
        }
        else{
            
            res.render('location/home',{'location': task,'dateformat':dateFormat});
        }
    });
}
exports.GetLocation=function(req, res){
    if (req.params.id == 0) {
        res.render('location/detail', { 'location': null,'arrImage':null });
    }
    else {
        Location.findOne({ _id: req.params.id }, function (err, task) {
            if (err)
                res.send(err);
            else {
                res.render('location/detail', { 'location': task ,'arrImage': task.image.split(',')});
            }
        });
    }
}
exports.PostLocation = function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var item = {}
        item.name = fields.name;
        item.description =fields.description;
        item.doctor = fields.doctor;
        item.address = fields.address;
        //item.country_id = fields.country_id;
        item.country_id = 1;        
        item.hotline = fields.hotline;
        item.map = fields.map;
        item.Open = fields.Open;
        item.Close = fields.Close;
        var img = files.photo;
        if(fields.list_img!=''){
            var string=''+fields.list_img+'';
            arrIma=string.split(',');
        }
        else{
            var arrIma=[];
        }
        if(fields.delete_img!=''){
            var arrIma1=''+fields.delete_img+'';
            var arrRemove=arrIma1.split(',');
            var t=arrRemove.length-1;
            for(var i=0;i<t; i++)
            {
                fs.stat("./public/images/location/"+arrRemove[i], function (err11, stats){
                    if(err11!=null){
                        console.log(err11);
                        let remove = fs.unlinkSync("./public/images/location/"+arrRemove[i]);
                    }
                }); 
                var index = arrIma.indexOf(arrRemove[i]);
                if (index > -1) {
                    arrIma.splice(index, 1);
                }
            }
        }
        if (img.length!=0) {
            for (var i =0; i < img.length; i++) {
                
                if(img[i].originalFilename!=''){
                    let data = fs.readFileSync(img[i].path);
                    let filenam=i+Date.now()+'.jpg';
                    let phyPath = "./public/images/location/" +filenam;
                    let realfile = fs.writeFileSync(phyPath, data);
                    arrIma.push(filenam);
                }
            }
        }  
        item.image=arrIma.toString();
        if (req.params.id == 0) {
            var location = new Location(item);
            location.save(function (err, task) {
                if (err)
                    res.send(err);
                else {
                    res.redirect('../location');
                }
            });
        }
        else{
            Location.findByIdAndUpdate(
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
                        res.redirect('../location');
                    }
                });
        }
    });
};
exports.DeleteLocation = function (req, res) {
    //var new_task=new Topic(req.body);
    Location.remove(
        {
            _id: req.params.id,
        },
        function (err, task) {
            if (err)
                res.send(err);
            res.redirect('../location');
        });
};