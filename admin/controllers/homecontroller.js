'use strict';
var mongooes = require('mongoose'),
    About = mongooes.model('About'),
    Features = mongooes.model('Features'),
    Process = mongooes.model('Process'),
    Info = mongooes.model('Info'),
    Menu = mongooes.model('Menu'),
    Statistic = mongooes.model('Statistic');
    

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
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var item = {}
        item.title = fields.title;
        item.description = fields.description;
        var img = files.images[0];
       
        if (img) {
            let data = fs.readFileSync(img.path);
            let filenam=Date.now()+ img.originalFilename;
            let phyPath = "./public/images/home/" +filenam;
            let realfile = fs.writeFileSync(phyPath, data);
            fs.stat("./public/images/home/"+fields.photo, function (err, stats){
                if(!err){
                    let remove = fs.unlinkSync("./public/images/home/"+fields.photo);
                }
            });
            item.photo = filenam;
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
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var item = {};
        item.title = fields.title;
        item.icon = fields.icon;
        item.sort_order = parseInt(fields.sort_order);
        var img = files.images[0];
        if (img) {
            let data = fs.readFileSync(img.path);
            let filenam=Date.now()+ img.originalFilename;
            let phyPath = "./public/images/home/" +filenam;
            let realfile = fs.writeFileSync(phyPath, data);
           
            item.photo = filenam;
        }
    
    if (req.params.id == 0) {
        var process = new Process(item);
        process.save(function (err, task) {
            if (err)
                res.send(err);
            else {
                res.redirect('../process');
            }
        });
    }
    else {
        Process.findByIdAndUpdate(
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
                    res.redirect('../process');
                }
            });
    };
});
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
    
    if (req.params.id == 0) {
        var info = new Info(req.body);
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
            req.body
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

//giới thiệu công ty
exports.AboutCompany=function(req, res){
    About.findOne({type:1}, function(err, task){
        if(err)
        {
            res.send(err);
        }
        else{
            res.render('home/about_company',{'about': task});
        }
    });
}

exports.PostAboutCompany = function (req, res) {
       
            About.findByIdAndUpdate(
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
                        res.redirect('../about-company-web');
                    }
                });
        
};
//Điều khoản sử dụng web
exports.TermWeb=function(req, res){
    About.findOne({type:2}, function(err, task){
        if(err)
        {
            res.send(err);
        }
        else{
            res.render('home/term_web',{'term': task});
        }
    });
}

exports.PostTermWeb = function (req, res) {
    if (req.params.id == 0) {
        var about = new About(req.body);
        about.save(function (err, task) {
            if (err)
                res.send(err);
            else {
                res.redirect('../term-web');
            }
        });
    }
    else{
        About.findByIdAndUpdate(
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
                    res.redirect('../term-web');
                }
            });
    }   
};

//chính sách bảo mật web
exports.SecurityWeb=function(req, res){
    About.findOne({type:3}, function(err, task){
        if(err)
        {
            res.send(err);
        }
        else{
            res.render('home/security_web',{'security': task});
        }
    });
}

exports.PostSecurityWeb = function (req, res) {
    if (req.params.id == 0) {
        var about = new About(req.body);
        about.save(function (err, task) {
            if (err)
                res.send(err);
            else {
                res.redirect('../security-web');
            }
        });
    }
    else{
        About.findByIdAndUpdate(
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
                    res.redirect('../security-web');
                }
            });
    }   
};
//Câu hỏi thường gặp web
exports.QuestionWeb=function(req, res){
    About.findOne({type:4}, function(err, task){
        if(err)
        {
            res.send(err);
        }
        else{
            res.render('home/question_web',{'question': task});
        }
    });
}

exports.PostQuestionWeb = function (req, res) {
    if (req.params.id == 0) {
        var about = new About(req.body);
        about.save(function (err, task) {
            if (err)
                res.send(err);
            else {
                res.redirect('../question-web');
            }
        });
    }
    else{
        About.findByIdAndUpdate(
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
                    res.redirect('../question-web');
                }
            });
    }   
};

//Thống kê
exports.Statistic = function (req, res) {
    Statistic.find({}, function (err, task) {
        if (err)
            res.send(err);
        else {
            //console.log(task);
            res.render('home/statistic', { 'statistic': task });
        }
    });

};
exports.PostStatisticWeb = function (req, res) {
    var item = {}
    item.title = req.body.title;
    item.sort_order = req.body.sort_order;
    item.quantity = req.body.quantity;
    item.icon = req.body.icon;
    if (req.body.id == 0) {
        var statistic = new Statistic(item);
        statistic.save(function (err, task) {
            if (err)
                res.send(err);
            else {
                res.redirect('../admin/statistic-web');
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
                    res.redirect('../admin/statistic-web');
                }
            });
    }
}
exports.DeleteStatistic = function (req, res) {
    //var new_task=new Topic(req.body);
    Statistic.remove(
        {
            _id: req.params.id,
        },
        function (err, task) {
            if (err)
                res.send(err);
            else {
                res.redirect('../statistic-web');
            }

        });
};