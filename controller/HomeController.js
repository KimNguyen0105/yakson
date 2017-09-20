'use strict';
var mongooes = require('mongoose');
//var slug=require('slugify');
exports.Index = function (req, res) {
    res.render('viewsfrontend/index',{
        'title_about':'GIỚI THIỆU',
        'text_about': '<p>Ứng dụng E-Member-App của chúng tôi là một sáng tạo thú vị sử dụng sức mạnh của công nghệ để đơn giản hóa mọi thẻ thành viên truyền thống.</p><p>Đơn giản và tiện lợi, chỉ vài  nút nhấn người sử dụng hoàn toàn có thể sở hữu một ứng dụng hiện đại, tinh tế nhưng không kém phần thân thiện phù hợp với mọi thẻ thành viên.</p>',
        'logo': '<img src="images/logo1.png" class="img-responsive" alt="pic1">'
        
    });
};