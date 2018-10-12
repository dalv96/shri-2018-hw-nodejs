const validTypes = ['info', 'critical'];
const fs = require('fs');

module.exports = function (app) {

  app.get('/status', (req, res) => {
    let upTime = process.uptime(),
        hour = formatToTime(Math.floor(upTime / 3600)),
        min = formatToTime(Math.floor(upTime % 3600 / 60)),
        second = formatToTime(Math.floor(upTime % 3600 % 60));
  
    res.send(`${hour}:${min}:${second}`);
  });
  
  app.get('/api/events', (req, res) => {
    let events = getEvents(req.query);
    if (events == 'TypeError') return res.sendStatus(400);
    if (events == 'ServerError') return res.sendStatus(500);

    res.send(events);
  });
  
  app.post('/api/events', (req, res) => {
    let events = getEvents(req.query);
  
    // Использовать эту строку, вместо предыдущей, если
    // нужно принимать параметры из тела запроса
    // let events = getEvents(req.body); 
  
    if (events == 'TypeError') return res.sendStatus(400);
    
    res.send(events);
  });
  
  app.use('*', (req, res) => {
    res.status(404).send('<h1>Page not found</h1');
  });

}

function formatToTime(val) {
  return (val < 10)?`0${val}`:`${val}`;
}

function getEvents(options) {
    let types = [],
      page = +options.page,
      perPage = options.perPage || 5;

  if (options.type) {
    types = options.type.split(':');

    for (let i = 0; i < types.length; i++)
      if (!validTypes.includes(types[i])) return 'TypeError';
  }

  let events;
  
  try {
    events = JSON.parse(fs.readFileSync('./events.json')).events;
  } catch (err) {
    return 'ServerError';
  }

  if (!events) return 'ServerError';

  if (types.length > 0) {
    let tmp = [];

    for (let i = 0; i < events.length; i++)
      if ( types.includes(events[i].type) ) tmp.push(events[i]);

    events = tmp;
  }

  if (page) {
    if (page < 0 || !Number.isInteger(page)) return 'TypeError';

    events = events.slice((page-1) * perPage, page*perPage);

    if (events.length == 0) return 'TypeError';
  }

  return events;
}