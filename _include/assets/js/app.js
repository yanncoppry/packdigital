jQuery(window).scroll(function(){
    var sticky = jQuery('header'),
        scroll = jQuery(window).scrollTop();
  
    if (scroll >= 10) sticky.addClass('scroll');
    else sticky.removeClass('scroll');
  });

  $(document).ready(function () {

    $('a').on('click',function (e) {
       e.preventDefault();
 
       var target = this.hash,
       $target = $(target);
 
       $('html, body').stop().animate({
           'scrollTop': $target.offset().top
       }, 800, 'swing', function () {
           window.location.hash = target;
       });
   });
   
 });


  // MENU
jQuery(".btn-success").click(function() {
    jQuery(this).closest('fieldset').toggleClass("formHidden");
    jQuery(this).closest('fieldset').next('fieldset').toggleClass("formHidden");
  });



