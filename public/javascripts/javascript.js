(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
      $('a.page-scroll').bind('click', function(event) {
            var $anchor = $(this);
            var href = $anchor.attr('href');
            var id = '#' + href.replace('/#', '');
            var targetElem = $(id);

            $('.active').removeClass('active');
            var a = $('a[href="/'+id+'"]');
            a.addClass('active');

            if (targetElem.length) {
                event.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: targetElem.offset().top-80

                }, 1000, 'easeInOutExpo');
            }
        });

        $('body').scrollspy({
            target: '.navbar-fixed-top',
            offset: 0
        });
})(jQuery);


$(function() {

	var about = $('section#about').position().top-80;
	var height_about =$('#about').height()+180;
	var home = $('section#home').position().top-80;
	var height_home =$('#home').height();


    $(window).scroll(function() {
        var scroll = $(window).scrollTop() + 90;

       	var croll = $(window).scrollTop();
        if(croll > about && croll < about+height_about)
        {
        	$('.active').removeClass('active');
        	$('a[href="/#about"]').addClass('active');
        }
        else if(croll > home && croll < home+height_home)
        {
        	$('.active').removeClass('active');
        	$('a[href="/#home"]').addClass('active');
        }
        else{
        	$('.active').removeClass('active');
        }

        var currentArea = $("section").filter(function() {
        	return scroll <= $(this).offset().top + $(this).height();
        });
        $(".nav a").removeClass("selected");
        $(".nav a[href=#" + currentArea.attr("id") + "]").addClass("selected");

        if ($(window).scrollTop() > 100) {
            $('nav').addClass("navScroll");
            $('img.logo').addClass("logoScroll");
            $('div.menu').addClass("menuScroll");
        } else if ($(window).scrollTop() < 100 ) {
            $('nav').removeClass("navScroll");
            $('img.logo').removeClass("logoScroll");
            $('div.menu').removeClass("menuScroll");
        }
    });
});

