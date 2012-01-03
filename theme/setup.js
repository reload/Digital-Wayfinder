d = function(msg,name){

  if(name !== undefined){
    console.log(name+': '+msg);
  }
  console.log(msg);
}

jQuery(function(){

  isiPad = navigator.userAgent.match(/iPad/i) != null;
  webApp = window.navigator.standalone;
  isAdminApp = window.location.hash.substring(1) == 'admin';


  var activeFloor = 0;
  var activeKeyword = 0;
  var initialFloor = 0;
  var activeDataId = 0;

  var itemClicked = 0;

  var clickedId = 0;


  // get floor from storage
  if(localStorage.getItem("floor")){
    initialFloor = localStorage.getItem("floor");
    activeFloor = initialFloor;
  }
  else{
    initialFloor = 0;
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
  $(data).each(function(fi){

    $('.floornav').append('<li>'+this.name+'</li>');
    $('.keywords').append('<li><ul></ul></li>');



    if (!isAdminApp) {
      $(this.keywords).each(function(i){
        $('.keywords li:last-child ul:not(.floor-list)').append('<li data-id="'+this.id+'">'+this.name+'</li>');
        var dataid = this.id;
        // this element also exists on other floors
        $(data).each(function(floorId){
          $(this.keywords).each(function(elementId){
            if(floorId == fi){
              return;
            }
            if(dataid == this.id) {
              if($('.keywords > li:last-child > ul > li:last-child > ul')[0] == undefined){
                d('not');
                $('.keywords > li:last-child > ul > li:last-child').append('<ul class="floor-list"></ul>');
              }
              $('.keywords > li:last-child > ul > li:last-child > ul.floor-list').append('<li>'+data[floorId].name+'</li>');
              $('.keywords > li:last-child > ul > li:last-child > ul.floor-list > li:last-child').click(function(){
                changeFloorPlan(floorId,false);
              });
            }
          });
        });

      });
    }
  });

  // change overlay
  $('.keywords > li > ul > li').click(function(){
    activeKeyword = $('.keywords > li > ul > li').index(this);

    itemClicked = $(this);

    clickedId = $(this).attr('data-id');

    var indexa = 0;
    var found = false;
    $(data).each(function(fi){
      $(this.keywords).each(function(ei){
        if(indexa == activeKeyword) {
          found = true;
          if(found){
            changeOverlay(fi,ei);
            activeDataId = $('.keywords > li > ul:eq('+fi+') > li:eq('+ei+')').attr('data-id');
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

    changeFloorPlan(activeFloor,false);

    if(isAdminApp) {
      localStorage.setItem("floor", activeFloor);
    }
  });

  function changeFloorPlan(index,reset){
    $('.keywords > li > ul').fadeOut('fast');
    $('.floorplan-image').animate({
      'opacity': 0
    },'fast',function(){
      // if target layer contains same id, select that id
      elementid = null;
      if(!reset) {
       $(data[index].keywords).each(function(i){
         //console.log(this);
         if(this.id == activeDataId) {
           elementid = i;
         }
       });
      }
      if(elementid == null) {
        activeDataId = 0;
      }
      changeOverlay(index,elementid);
      $('.keywords > li > ul:eq('+index+')').fadeIn('fast');
      $('.floorplan-image').attr('src', 'files/' + data[index].filename);
      $('.floorplan-image').animate({
        'opacity': 1
      },'fast');
    });



    $('.floornav li:eq('+index+')').siblings().removeClass('red-gradient');
    $('.floornav li:eq('+index+')').addClass('red-gradient');
  }

  function changeOverlay(floorIndex,elementIndex) {

    $('.keywords > li > ul > li').removeAttr('class');
    if(elementIndex == null) {
      $('.element-image').hide();
    }
    else{
      $('.element-image').show();
      $('.keywords > li > ul:eq('+floorIndex+') > li:eq('+elementIndex+')').addClass('act');
      $('.element-image').attr('src', 'files/' + data[floorIndex].keywords[elementIndex].filename);
    }
  }

  function landscapeOrient(){
    if(window.orientation == 0 || window.orientation == 180) {
      $('body').prepend('<div class="error overlay"><h1 class="webapp">This app was only designed<br>for landscape orientation. Please rotate your device</h1><br><a href="http://reload.dk" target="_blank"><img src="theme/reload.svg"></a></div>');
    }
    else {
      $('body > .error').remove();
    }
  }

  changeFloorPlan(initialFloor,true);
  landscapeOrient();



  if(isAdminApp){
    // show a diffrent app icon
    $('link[rel=apple-touch-icon-precomposed]').attr('href','theme/admin_icon.png');
  }
  else{
    // when the document is clicked terminate countdown to reset
    appReset.init(function(){changeFloorPlan(initialFloor,true)});
  }
});

appReset = {
  'callback' : function(){ },
  'countdown' : 0,
  'initialCountdown' : 15,
  'init' : function(callback){
    this.callback = callback;
    this.start();
    this.handlers();
  },
  'start' : function(){
    setInterval(function(){
      appReset.countdown--;
      if(appReset.countdown == 0) {
        appReset.reset();
      }
    },1000);
  },
  'handlers' : function(){
    $('body').click(function(){
      appReset.countdown = appReset.initialCountdown;
    });
    // the event should trigger on touchstart and touchmove instead
   /* $('*').ontouchstart = function(evt){
      alert(evt.pageX + "/" + evt.pageY);
      // OH NO! These values are blank, this must be a bug
    }*/
  },
  'reset' : function(){
    this.callback();
    d('app resetting!');
  }
}
