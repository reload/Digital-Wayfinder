jQuery(function(){

  isiPad = navigator.userAgent.match(/iPad/i) != null;
  webApp = window.navigator.standalone;
  isAdminApp = window.location.hash.substring(1) == 'admin';

  var countdown = 0;
  var initialCountdown = 15;
  var activeFloor = 0;
  var initialFloor = 0;

  // get floor from storage
  if(localStorage.getItem("floor")){
    initialFloor = localStorage.getItem("floor");
  }
  else{
    initialFloor = 0;
  }

  if(isAdminApp) {
    $('link[rel=apple-touch-icon-precomposed]').attr('href','theme/admin_icon.png');
    $('body').prepend('<input class="inp" placeholder="Indtast dit navn" type="text" name="handle">');
    /*$('.inp').keydown(function(e){
      console.log(e.keyCode);
      if(e.keyCode == 13) {
        localStorage.setItem("floor", $('.inp').val());
      }
    });*/
  }

  if (isiPad && !webApp) {
    // prevent application to be run as a webpage
    $('body').prepend('<div class="error overlay"><h1 class="webapp">Please add to homescreen<br>inorder to use<br>this app</h1><br><a href="http://reload.dk" target="_blank"><img src="theme/reload.svg"></a></div>');
    return false;
  }

  window.addEventListener("orientationchange", function() {
    landscapeOrient();
  }, false);


  // build floors list
  $(data).each(function(i){

    $('.floornav').append('<li>'+this.name+'</li>');
    $('.keywords').append('<li><ul></ul></li>');

    if (!isAdminApp) {
      $(this.keywords).each(function(i){
        $('.keywords li:last-child ul').append('<li data-id="'+this.id+'">'+this.name+'</li>');
      });
    }
  });

  // change overlay
  $('.keywords li ul li').click(function(){
    var clickedElementIndex = $('.keywords li ul li').index(this);
    $(this).siblings().removeClass('act');
    $(this).addClass('act');
    var indexa = 0;
    var found = false;
    $(data).each(function(fi){
      $(this.keywords).each(function(ei){
        if(indexa == clickedElementIndex) {
          found = true;
          if(found){
            changeOverlay(fi,ei)
            return false;
          }
        }
        indexa++;
      });
      if(found){
        return false;
      }
    });
  });

  $('.floornav li').click(function(){
    activeFloor = $('.floornav li').index(this);

    changeFloorPlan(activeFloor);
  });

  function changeFloorPlan(index){
    $('.keywords li ul').fadeOut('fast');
    $('.floorplan-image').animate({
      'opacity': 0
    },'fast',function(){
      $('.keywords li ul:eq('+index+')').fadeIn('fast');
      $('.floorplan-image').attr('src', 'files/' + data[index].filename);
      $('.floorplan-image').animate({
        'opacity': 1
      },'fast');
    });



    $('.floornav li:eq('+index+')').siblings().removeClass('red-gradient');
    $('.floornav li:eq('+index+')').addClass('red-gradient');
  }

  function changeOverlay(floorIndex,elementIndex) {
    $('.element-image').attr('src', 'files/' + data[floorIndex].keywords[elementIndex].filename);
  }

  function landscapeOrient(){
    if(window.orientation == 0 || window.orientation == 180) {
      $('body').prepend('<div class="error overlay"><h1 class="webapp">This app was only designed<br>for landscape orientation. Please rotate your device</h1><br><a href="http://reload.dk" target="_blank"><img src="theme/reload.svg"></a></div>');
    }
    else {
      $('body > .error').remove();
    }
  }

  changeFloorPlan(initialFloor);
  landscapeOrient();


  // when the document is clicked terminate countdown to reset

  if (!isAdminApp){
    startCountdown();
    function resetApp() {
      changeFloorPlan(initialFloor);
      console.log('app resetting!');
    }

    $('body').click(function(){
      countdown = initialCountdown;
    });
    function startCountdown(){
      setInterval(function(){
        countdown--;
        if(countdown == 0) {
          resetApp();
        }
        console.log(countdown);
      },1000);
    }
  }
});
