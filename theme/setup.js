jQuery(function(){


  // build floors list
  $(data).each(function(i){

    $('.floornav').append('<li>'+this.name+'</li>');
    $('.keywords').append('<li><ul></ul></li>');

    $(this.keywords).each(function(i){
      $('.keywords li:last-child ul').append('<li data-id="'+this.id+'">'+this.name+'</li>');
    });

  });

  // change overlay
  $('.keywords li ul li').click(function(){
    var clickedElementIndex = $('.keywords li ul li').index(this);
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
    var clickedFloorIndex = $('.floornav li').index(this);


    changeFloorPlan(clickedFloorIndex);

  });

  function changeFloorPlan(index){
    $('.floorplan-image').attr('src', 'files/' + data[index].filename);
    $('.keywords li ul').hide();
    $('.keywords li ul:eq('+index+')').show();
    $('.floornav li:eq('+index+')').siblings().removeClass('red-gradient');
    $('.floornav li:eq('+index+')').addClass('red-gradient');
  }

  function changeOverlay(floorIndex,elementIndex) {
    $('.element-image').attr('src', 'files/' + data[floorIndex].keywords[elementIndex].filename);
  }


  changeFloorPlan(0);

});
