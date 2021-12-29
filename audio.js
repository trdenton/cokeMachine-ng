// audio.js

function audio()
{
  if (!(this instanceof audio))
    return new audio();

  //console.log('loaded audio module');
};

var exec = require('child_process').exec;
module.exports = audio;

audio.prototype.play = function (fileName)
{
  //exec("mpg123 "+ fileName, null);
  exec("sleep 3", null);
}
