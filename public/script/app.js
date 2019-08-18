
$(document).ready(() => {

  const escape = str => {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const promise1 = () => {
    return new Promise((resolve, reject) => {
      $.getJSON('https://www.reddit.com/r/heroesofthestorm/.json', (data) => {
        resolve(data);
      });
    });
  };

  const appendData = (data) => {
    console.log(data.data);
    let html = `<p>${escape(data)}</p>`;
    $('#apiDump').append(html);
  };

  $('#api').submit((event) => {
    event.preventDefault();
    promise1()
      .then((data) => appendData(data));
  });

});

