
$(document).ready(() => {
  // const url = 'https://www.reddit.com/r/Warframe/.json';
  let url = '';
  const hours = [0, 0, 0, 0];
  let htmlTotal = '';

  //SANITIZE
  const escape = (str) => {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const promise1 = (url) => {
    return new Promise((resolve, reject) => {
      $.getJSON(url, (data) => {
        aggHr(data);
        appendData(data);
        resolve(data);
      });
    });
  };

  const reset = () => {
    url = '';
    htmlTotal = '';
    hours[0] = 0;
    hours[1] = 0;
    hours[2] = 0;
    hours[3] = 0;
  };

  const newQuery = (data) => {
    return `${url}?count=25&after=${data.data.after}`;
  };

  //USING UTC
  const hoursAgo = (ms) => {
    return ((Date.now() / 1000) - ms) / 3600;
  };

  const appendData = (data) => {
    data.data.children.forEach(child => {
      htmlTotal += `<li>${escape(child.data.title)} ${Math.round(hoursAgo(child.data.created_utc))} hours ago</li>`;
    });
    
  };

  //CURRENTLY SET FOR ONLY 3 API PAGES
  $('#api').submit((event) => {
    event.preventDefault();

    url = escape($('#api input').val());

    //HANDLES EMPTY REDDIT URLS
    if (!url) {
      return false;
    } else if (htmlTotal) {
      reset();
      console.log('url', url);
      console.log('htmlTotal', htmlTotal);
      console.log('hours', hours);
      url = escape($('#api input').val());
    }
    
    promise1(url)
      .then((data) => promise1(newQuery(data)))
      .then((data) => promise1(newQuery(data)))
      .then(() => {
        $('#apiDump').append(htmlTotal);
        hourChart(hours, myChart);
      })
      //NOT WORKING CURRENTLY
      .catch((err) => console.log(err, 'Failure to pull Request'));
      
  });

  const aggHr = (dataset) => {
    dataset.data.children.forEach(child => {
      let hour = Math.round(hoursAgo(child.data.created_utc));
      if (hour <= 3) {
        hours[0] += 1;
      } else if (hour <= 8) {
        hours[1] += 1;
      } else if (hour <= 24) {
        hours[2] += 1;
      } else {
        hours[3] += 1;
      }
    });
  };

  const hourChart = (hours, chart) => {

    const ctx = document.getElementById('myChart').getContext('2d');
    //[0] 0-3 hours
    //[1] 3-8 hours
    //[2] 8-24 hours
    //[3] 24+
    // console.log(chart.config.data.datasets[0].data);

    // for (let i = 0; i < 4; i++) {
    //   chart.config.data.datasets[0].data = hours[i];
      // chart.config.data.datasets[0].data.unshift(hours[3 - i]);
    // }

    // console.log(chart.config.data.datasets[0].data);
    // console.log(hours[4]);
    // for (let i = 0; i < 4; i++) {
    //   chart.config.data.datasets[0].data.push(hours[i]);
    // }

    // chart.update();

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['0-3h', '3-8h', '8-24h', '24h+'],
        datasets: [{
          label: 'post creation',
          data: hours,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  };

  // const ctx = document.getElementById('myChart').getContext('2d');
  // const myChart = new Chart(ctx, {
  //   type: 'bar',
  //   data: {
  //     labels: ['0-3h', '3-8h', '8-24h', '24h+'],
  //     datasets: [{
  //       label: 'post creation',
  //       data: hours,
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 0.2)',
  //         'rgba(54, 162, 235, 0.2)',
  //         'rgba(255, 206, 86, 0.2)',
  //         'rgba(75, 192, 192, 0.2)',
  //       ],
  //       borderColor: [
  //         'rgba(255, 99, 132, 1)',
  //         'rgba(54, 162, 235, 1)',
  //         'rgba(255, 206, 86, 1)',
  //         'rgba(75, 192, 192, 1)',
  //       ],
  //       borderWidth: 1
  //     }]
  //   },
  //   options: {
  //     scales: {
  //       yAxes: [{
  //         ticks: {
  //           beginAtZero: true
  //         }
  //       }]
  //     }
  //   }
  // });
});

