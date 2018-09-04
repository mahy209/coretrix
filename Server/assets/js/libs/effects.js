
$(document).ready(function(){
  $('.student_data').on('click', function(){
      $('.student_data').removeClass('z-depth-5');
      $(this).addClass('z-depth-5');
      $('.student_data').removeClass('select');
      $(this).addClass('select');

  });
  $(".mohamed").on('click', function(){
     $('.mohamed_p').removeClass('hide');
     $('.mohap_p').addClass('hide');
     $('.ali_p').addClass('hide');

  });
  $(".mohap").on('click', function(){
     $('.mohap_p').removeClass('hide');
     $('.mohamed_p').addClass('hide');
     $('.ali_p').addClass('hide');

  });
  $(".ali").on('click', function(){
     $('.ali_p').removeClass('hide');
     $('.mohamed_p').addClass('hide');
     $('.mohap_p').addClass('hide');

  });
  $(window).load(function() {
  		// Animate loader off screen
  		$(".preloader-wrapper").fadeOut("slow");;
  	});


});
