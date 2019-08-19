
$(document).ready(() => {
  const url = 'https://www.reddit.com/r/Warframe/.json';
  const hours = [0, 0, 0, 0];

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
        aggHr(data);
        promise1(newQuery(data))
          .then((data) => {
            appendData(data);
            aggHr(data);
            hourChart(hours);
          });
      });

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

  const hourChart = (hours) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    //[0] 0-3 hours
    //[1] 3-8 hours
    //[2] 8-24 hours
    //[3] 24+
    
    // hours.push(Math.round(hoursAgo(child.data.created_utc)));

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
  
});

