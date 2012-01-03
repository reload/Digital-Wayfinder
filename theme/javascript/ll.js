/**
 * *file
 * Lenda Library v0.0.2
 *
 * Contains various helper function, mostly meant for development
 */

d = function(msg,name){
  if(name !== undefined){
    console.log(name+': '+msg);
    return;
  }
  console.log(msg);
}
