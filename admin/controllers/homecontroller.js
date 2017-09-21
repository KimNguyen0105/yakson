'use strict';
var mongooes = require('mongoose'),
    About = mongooes.model('About'),
    Features = mongooes.model('Features'),
    Process = mongooes.model('Process'),
    Info = mongooes.model('Info'),
    Menu = mongooes.model('Menu');


var sess = {
    secret: 'hbbsolutions',
    cookie: {}
}
var multiparty = require('multiparty');
var fs = require("fs");
//   var generator = require('../../util/generator');
//var slug=require('slugify');
exports.Home = function (req, res) {
    res.render('home');
};
exports.CreateAbout = function (req, res) {

    About.find({ type: 0 }, function (err, task) {
        if (err)
            res.send(err);
        else {
            //console.log(task);
            res.render('home/about', { 'about': task });
        }
    });

};
exports.CreateAboutApp = function (req, res) {

    About.find({ type: 1 }, function (err, task) {
        if (err)
            res.send(err);
        else {
            //console.log(task);
            res.render('home/about_app', { 'about': task });
        }
    });

};
exports.CreateAboutPost = function (req, res) {
    var new_task = new About();
    new_task.title = req.body.title;
    new_task.description = req.description;
    new_task.photo = "images";
    new_task.type = 1;
    new_task.save(function (err, task) {
        if (err)
            res.send(err);
        else {
            console.log(new_task);
        }
    });
};
//59c0ca204e6c361db41ccbb6
exports.UpdateAbout = function (req, res) {
    //var new_task=new Topic(req.body);
    // upload('about').single('photo')(req, res, function(err) {
    //     if (err) {
    //         return next(PromiseError(ErrorCode.VALIDATE_UPLOAD_FILE, err.message));
    //     }
    // });
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var item = {}
        item.title = fields.title;
        item.description = fields.description;
        var img = files.images[0];

        if (img) {
            let data = fs.readFileSync(img.path);
            let phyPath = "./public/images/home/" + img.originalFilename;
            let realfile = fs.writeFileSync(phyPath, data);
            let remove = fs.unlinkSync("./public/images/home/"+fields.photo);
            item.photo = img.originalFilename;
        }
        About.findByIdAndUpdate(
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
                    res.redirect('../about');
                }
            });
    });



};
exports.UpdateAboutApp = function (req, res) {
    //var new_task=new Topic(req.body);
    var item = {}
    item.title = req.body.title;
    item.description = req.body.description;
    About.findByIdAndUpdate(
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
};
exports.Delete = function (req, res) {
    //var new_task=new Topic(req.body);
    About.remove(
        {
            _id: req.params.id,
        },
        function (err, task) {
            if (err)
                res.send(err);
            res.status(200).send(JSON.stringify({
                success: true,
                data: task,
                errorCode: '',
            }));
        });
};
//tính năng ưu việt
exports.Features = function (req, res) {
    Features.find({}, function (err, task) {
        if (err)
            res.send(err);
        else {
            //console.log(task);
            res.render('home/features', { 'features': task });
        }
    });

};

exports.getFeatures = function (req, res) {
    if (req.params.id == 0) {
        res.render('home/features_detail', { 'features': null });
    }
    else {
        Features.findOne({ _id: req.params.id }, function (err, task) {
            if (err)
                res.send(err);
            else {
                //console.log(task);
                //var data=JSON.stringify(task);
                res.render('home/features_detail', { 'features': task });
            }
        });
    }

}
exports.DeleteFeatures = function (req, res) {
    //var new_task=new Topic(req.body);
    Features.remove(
        {
            _id: req.params.id,
        },
        function (err, task) {
            if (err)
                res.send(err);
            res.redirect('../features');
        });
};

exports.UpdateFeatures = function (req, res) {
    //var new_task=new Topic(req.body);

    if (req.params.id == 0) {
        var features = new Features();
        features.title = req.body.title;
        features.description = req.body.description;
        features.save(function (err, task) {
            if (err)
                res.send(err);
            else {
                res.redirect('../features');
            }
        });
    }
    else {
        var item = {}
        item.title = req.body.title;
        item.description = req.body.description;
        Features.findByIdAndUpdate(
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
                    res.redirect('../features');
                }
            });
    }

};
//quy trình
exports.Process = function (req, res) {
    Process.find({}, function (err, task) {
        if (err)
            res.send(err);
        else {
            //console.log(task);
            res.render('home/process', { 'processes': task });
        }
    });

};
exports.getProcess = function (req, res) {
    if (req.params.id == 0) {
        res.render('home/process_detail', { 'processes': null });
    }
    else {
        Process.findOne({ _id: req.params.id }, function (err, task) {
            if (err)
                res.send(err);
            else {
                //console.log(task);
                //var data=JSON.stringify(task);
                res.render('home/process_detail', { 'processes': task });
            }
        });
    }

}
exports.DeleteProcess = function (req, res) {
    //var new_task=new Topic(req.body);
    Process.remove(
        {
            _id: req.params.id,
        },
        function (err, task) {
            if (err)
                res.send(err);
            res.redirect('../process');
        });
};
exports.UpdateProcess = function (req, res) {
    var item = {}
    item.title = req.body.title;
    item.icon = req.body.icon;
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
//informaion
exports.Info = function (req, res) {
    Info.findOne({}, function (err, task) {
        if (err)
            res.send(err);
        else {
            //console.log(task);
            res.render('home/info', { 'info': task });
        }
    }).limit(1);

};
exports.PostInfo = function (req, res) {
    var item = {}
    item.email = req.body.email;
    item.phone = req.body.phone;
    item.address = req.body.address;
    item.facebook = req.body.facebook;
    item.twitter = req.body.twitter;
    item.google = req.body.google;
    item.linkedin = req.body.linkedin;
    item.printerest = req.body.printerest;
    if (req.params.id == 0) {
        var info = new Info(item);
        info.save(function (err, task) {
            if (err)
                res.send(err);
            else {
                res.redirect('../info');
            }
        });
    }
    else {
        Info.findByIdAndUpdate(
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
                    res.redirect('../info');
                }
            });
    }
};
//menu
exports.Menu = function (req, res) {
    Menu.find({}, function (err, task) {
        if (err)
            res.send(err);
        else {
            //console.log(task);
            res.render('home/menu', { 'menu': task });
        }
    });

};
exports.PostMenu = function (req, res) {
    var item = {}
    item.title = req.body.title;
    item.sort_order = req.body.sort_order;
    if (req.body.id == 0) {
        var menu = new Menu(item);
        menu.save(function (err, task) {
            if (err)
                res.send(err);
            else {
                res.redirect('../admin/menu');
            }
        });
    }
    else {
        Menu.findByIdAndUpdate(
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
                    res.redirect('../admin/menu');
                }
            });
    }
}
exports.DeleteMenu = function (req, res) {
    //var new_task=new Topic(req.body);
    Menu.remove(
        {
            _id: req.params.id,
        },
        function (err, task) {
            if (err)
                res.send(err);
            else {
                res.redirect('../menu');
            }

        });
};