
$(document).ready(() => {
  const url = 'https://www.reddit.com/r/Warframe/.json';

  //SANITIZE
  const escape = str => {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const promise1 = (url) => {
    return new Promise((resolve, reject) => {
      $.getJSON(url, (data) => {
        resolve(data);
      });
    });
  };

  const newQuery = (data) => {
    return `${url}?count=25&after=${data.data.after}`;
  };

  //USING UTC
  const hoursAgo = (ms) => {
    return ((Date.now() / 1000) - ms) / 3600;
  };

  const appendData = (data) => {
    let htmlTotal = '';
    
    data.data.children.forEach(child => {
      htmlTotal += `<li>${escape(child.data.title)} ${Math.round(hoursAgo(child.data.created_utc))} hours ago</li>`;
    });
    
    $('#apiDump').append(htmlTotal);
  };

  //CURRENTLY SET FOR ONLY 2 API PAGES AND NOT FLEXIBLE
  $('#api').submit((event) => {
    event.preventDefault();

    promise1(url)
      .then(data => {
        appendData(data);
        promise1(newQuery(data))
          .then((data) => appendData(data));
      });

  });

});

