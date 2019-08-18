const request = require('request');

$(document).ready(() => {

  console.log('hello');

  $('#api button').click(() => {

    request('https://www.reddit.com/r/heroesofthestorm/.json', (err, data) => {
      if (err) console.log(err);
    });
  });

});

