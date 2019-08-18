
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
    const post = [];
    // console.log(data.data.children[0].data.title);
    data.data.children.forEach(child => {
      console.log(child.data.title);
      post.push(child.data.title);
    });

    // console.log(data.data.children);
    let html = `<p>${escape(post)}</p>`;
    $('#apiDump').append(html);
  };

  $('#api').submit((event) => {
    event.preventDefault();
    promise1()
      .then((data) => appendData(data));
  });

});

