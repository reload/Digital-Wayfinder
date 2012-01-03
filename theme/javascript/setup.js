jQuery(function($){

  isiPad = navigator.userAgent.match(/iPad/i) != null;
  webApp = window.navigator.standalone;
  isAdminApp = window.location.hash.substring(1) == 'admin';


  //var activeFloor = 0;
  //var activeKeyword = 0;
  var initialFloor = 0;
  //var activeDataId = 0;

  var global = {};

  //var itemClicked = 0;

  //var clickedId = 0;
  //var aggregate = false;


  // get floor from storage
  if(localStorage.getItem("floor")){
    initialFloor = localStorage.getItem("floor");
    global.activeFloor = initialFloor;
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
  $(data).each(function(floorid){

    // prepare each floor for keywords and build floor pagination
    $('.floornav').append('<li>'+this.name+'</li>');
    $('.floornav > li:last-child').click(function(){
      changeFloorPlan(floorid,false);
      if(isAdminApp) {
        localStorage.setItem("floor", floorid);
      }
    });
    $('.keywords').append('<li><ul></ul></li>');
    if (!isAdminApp) {
      $(this.keywords).each(function(i){
        // Create a list item in the last created Unordered List and bind a clickevent
        $('.keywords > li:last-child > ul').append('<li data-id="'+this.id+'" data-floor-id="'+floorid+'">'+this.name+'</li>');
        $('.keywords > li:last-child > ul > li:last-child').click(function(){
          global.activeKeywordId = $(this).attr('data-id');
          changeOverlay(floorid,i);
          // Set the active state on keywords
          $('.keywords > li > ul > li').removeAttr('class');
          $('.keywords > li > ul > li[data-id="'+global.activeKeywordId+'"]').addClass('act');
        });
      });
    }
  });
  // aggregate keyword list
  $('.keywords').append('<li class="aggregated"><ul></ul></li>');
  $('.keywords > li > ul > li').clone(true).appendTo($('.keywords > li.aggregated > ul'));

  $('.topbar a').click(function(e){
    e.preventDefault();
    if(global.aggretate == true){
      global.aggretate = false;
      changeFloorPlan(global.activeFloor,false);
      $(this).removeClass('act');
      return;
    }
    global.aggretate = true;
    changeFloorPlan(global.activeFloor,false);
    $(this).addClass('act');
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
         if(this.id == global.activeKeywordId) {
           elementid = i;
         }
       });
      }
      if(elementid == null) {
        activeDataId = 0;
      }
      global.activeFloor = index;
      changeOverlay(index,elementid);
      if(!global.aggretate) {
        $('.keywords > li > ul:eq('+index+')').fadeIn('fast');
      }
      else{
        $('.keywords > li.aggregated > ul').fadeIn('fast');
      }

      $('.floorplan-image').attr('src', 'files/' + data[index].filename);
      $('.floorplan-image').animate({
        'opacity': 1
      },'fast');
    });



    $('.floornav li:eq('+index+')').siblings().removeClass('red-gradient');
    $('.floornav li:eq('+index+')').addClass('red-gradient');
  }

  function changeOverlay(floorIndex,elementIndex) {

    itemClicked = $('.keywords > li:eq('+floorIndex+') > ul > li:eq('+elementIndex+')');

    clickedId = $(itemClicked).attr('data-id');


      $('.keywords li ul li ul').remove();
      $(data).each(function(i){

        var floor = this;
        floor.id = i;

        ll.d(global.activeFloor);

        if(i != global.activeFloor){
         $(this.keywords).each(function(){
           if(this.id == clickedId){
             ll.d(itemClicked);
             if($('ul',itemClicked)[0] == undefined){
               $(itemClicked).append('<ul class="floor-list"></ul>');
             }
             $('ul',itemClicked).append('<li>' + floor.name+'</li>');
             $('ul > li:last-child',itemClicked).click(function(){
               changeFloorPlan(floor.id ,false);
               global.activeFloor = floor.id;
             });

            }


         });
        }
      });



    //$('.keywords > li > ul > li').removeAttr('class');
    if(elementIndex == null) {
      $('.element-image').hide('fast');
    }
    else{
      $('.element-image').show('fast');
      //$('.keywords > li > ul:eq('+floorIndex+') > li:eq('+elementIndex+')').addClass('act');
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
    // start countdown and bind handlers
    this.callback = callback;
    this.start();
    this.handlers();
  },
  'start' : function(){
    // countdown
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
    ll.d('app resetting!');
  }
}