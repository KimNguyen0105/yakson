'use strict';
module.exports = function (app) {

    var useradmin = require('../controllers/useradmincontroller');
    var home = require('../controllers/homecontroller');
    var card = require('../controllers/cardcontroller');
    var promotion = require('../controllers/promotioncontroller');
    var news = require('../controllers/newscontroller');
    var appcommon = require('../controllers/appcontroller');
    var location = require('../controllers/locationcontroller');




    //todolist Routes
    app.route('/admin/home').get(home.Home);
    app.route('/admin/about').get(home.CreateAbout);
    app.route('/admin/about-delete/:id').get(home.Delete);
    //about web
    app.route('/admin/about').post(home.CreateAboutPost);
    app.route('/admin/about/:id').post(home.UpdateAbout);
    //Giới thiệu công ty (web)
    app.route('/admin/about-company-web').get(home.AboutCompany);
    app.route('/admin/about-company-web/:id').post(home.PostAboutCompany);
    //Điều khoản sử dụng (web)
    app.route('/admin/term-web').get(home.TermWeb);
    app.route('/admin/term-web/:id').post(home.PostTermWeb);
    //Chính sách bảo mật (web)
    app.route('/admin/security-web').get(home.SecurityWeb);
    app.route('/admin/security-web/:id').post(home.PostSecurityWeb);
    //Câu hỏi thường gặp (web)
    app.route('/admin/question-web').get(home.QuestionWeb);
    app.route('/admin/question-web/:id').post(home.PostQuestionWeb);
    //Thống kê (web)
    app.route('/admin/statistic-web').get(home.Statistic).post(home.PostStatisticWeb);
    app.route('/admin/statistic-delete/:id').get(home.DeleteStatistic);

    //features
    app.route('/admin/features').get(home.Features);
    app.route('/admin/features/:id').get(home.getFeatures);
    app.route('/admin/features-detele/:id').get(home.DeleteFeatures);
    app.route('/admin/features/:id').post(home.UpdateFeatures);
    //qui trình
    app.route('/admin/process').get(home.Process);
    app.route('/admin/process/:id').get(home.getProcess).post(home.UpdateProcess);
    app.route('/admin/process-detele/:id').get(home.DeleteProcess);
    //thông tin chung
    app.route('/admin/info').get(home.Info);
    app.route('/admin/info/:id').post(home.PostInfo);
    //menu
    app.route('/admin/menu').get(home.Menu);
    app.route('/admin/menu').post(home.PostMenu);
    app.route('/admin/menu-delete/:id').get(home.DeleteMenu);



    //card type
    app.route('/admin/card-type').get(card.CardType);
    app.route('/admin/card-type/:id').get(card.GetCardType);
    app.route('/admin/card-type/:id').post(card.PostCardType);
    app.route('/admin/card-type-detele/:id').get(card.DeleteCardType);
    //promotion
    app.route('/admin/promotion').get(promotion.Promotion);
    app.route('/admin/promotion/:id').get(promotion.GetPromotion);
    app.route('/admin/promotion/:id').post(promotion.PostPromotion);
    app.route('/admin/promotion-detele/:id').get(promotion.DeletePromotion);
    //news
    app.route('/admin/news').get(news.News);
    app.route('/admin/news/:id').get(news.GetNews).post(news.PostNews);
    //app.route('/admin/news/:id').post(news.PostNews);
    app.route('/admin/news-detele/:id').get(news.DeleteNews);

    //điều khoản app
    app.route('/admin/term').get(appcommon.Term);
    app.route('/admin/term/:id').post(appcommon.PostTerm);
    //về công ty
    app.route('/admin/about-company').get(appcommon.AboutCompany);
    app.route('/admin/about-company/:id').post(appcommon.PostAboutCompany);
    //about app
    app.route('/admin/about-app').get(appcommon.AboutApp);
    app.route('/admin/about-app/:id').post(appcommon.PostAboutApp);
    //location
    app.route('/admin/location').get(location.Location);
    app.route('/admin/location/:id').post(location.PostLocation).get(location.GetLocation);
    app.route('/admin/location-delete/:id').get(location.DeleteLocation);
    //user
    app.route('/admin/user-app').get(appcommon.UserApp).post(appcommon.PostNewUserApp);
    app.route('/admin/user-app-new').get(appcommon.GetUserApp);
    app.route('/admin/user-app-update-password').post(appcommon.UpdatePassUserApp);
    app.route('/admin/user-app/:id').post(appcommon.PostUpdateUserApp).get(appcommon.GetDetailUserApp);
    app.route('/admin/user-app-delete/:id').get(appcommon.DeleteUserApp);




    app.route('/admin/login').get(useradmin.Login);
    app.route('/admin/login').post(useradmin.PostLogin);
    app.route('/admin/user-admin').get(useradmin.Home);
    app.route('/admin/user-admin').post(useradmin.Create);



    // app.route('/create').post(topic.Create);
    // app.route('/update/:topic_id').post(topic.Update);
    // app.route('/delete/:topic_id').get(topic.Delete);
    // app.route('/views').get(topic.ViewsData);
};