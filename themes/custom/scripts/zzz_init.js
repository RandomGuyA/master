$(window).scroll(function(){

    var $footer = $('.js-footer');
    var height = $footer.outerHeight();
    var scroll_height = $(document).height() - $(window).height();
    if ($(window).scrollTop() == scroll_height ) {
        $footer.animate({
            bottom:'0px'
        }, 500, function() {
            $footer.addClass('active');
        });
    }
    if($footer.hasClass('active')){
        if ($(window).scrollTop() != scroll_height) {
            $footer.removeClass('active');
            $footer.animate({
                bottom:'-'+height+'px'
            }, 500, function() {

            });
        }
    }



});
