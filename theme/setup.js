jQuery(function(){
  console.log(data);


  // append list



  // build floors list

  $(data).each(function(i){
    $('.plans').append('<li>'+this.name+'</li>');
  });



  $('.plans li').click(function(){
    setKeywords($('.plans li').index(this));

  });


  function setKeywords(index){
    $('.keywords').html('');
    $(data[index].keywords).each(function(i){
      console.log(this);
      $('.keywords').append('<li>'+this.name+'</li>');
    });
  }

});
