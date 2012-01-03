/**
 * *file
 * Lenda Library v0.0.2
 *
 * Contains various helper function, mostly meant for development
 */
ll = {
  'd': function (msg, name) {
    if (name !== undefined) {
      console.log(name + ': ' + msg);
      return;
    }
    console.log(msg);
  },
  'sort' : function sortAlpha(a,b){
    return a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase() ? 1 : -1;
  }
};
