'use strict';
module.exports=function(app){

    var useradmin=require('../controllers/useradmincontroller');
    var home=require('../controllers/homecontroller');
    var card=require('../controllers/cardcontroller');
    
    
//todolist Routes
    app.route('/admin/home').get(home.Home);
    app.route('/admin/about').get(home.CreateAbout);
    app.route('/admin/about-delete/:id').get(home.Delete);
    //about web
    app.route('/admin/about').post(home.CreateAboutPost);
    app.route('/admin/about/:id').post(home.UpdateAbout);
    //about app
    app.route('/admin/about-app').get(home.CreateAboutApp);
    app.route('/admin/about-app/:id').post(home.UpdateAboutApp);
    //features
    app.route('/admin/features').get(home.Features);
    app.route('/admin/features/:id').get(home.getFeatures);
    app.route('/admin/features-detele/:id').get(home.DeleteFeatures);
    app.route('/admin/features/:id').post(home.UpdateFeatures);
    //qui trình
    app.route('/admin/process').get(home.Process);
    app.route('/admin/process/:id').get(home.getProcess);
    app.route('/admin/process').post(home.UpdateProcess);
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
    //app.route('/admin/card-type/:id').post(card.PostCardType);


    app.route('/admin/login').get(useradmin.Login);
    app.route('/admin/login').post(useradmin.PostLogin);
    app.route('/admin/user-admin').get(useradmin.Home);
    app.route('/admin/user-admin').post(useradmin.Create);

    
    
    // app.route('/create').post(topic.Create);
    // app.route('/update/:topic_id').post(topic.Update);
    // app.route('/delete/:topic_id').get(topic.Delete);
    // app.route('/views').get(topic.ViewsData);
};