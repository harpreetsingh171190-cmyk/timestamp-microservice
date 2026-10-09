const express = require('express');
const cors = require('cors');
const app = express();

// Trust proxy to get correct IP behind Render
app.set('trust proxy', true);

app.use(cors({ optionsSuccessStatus: 200 }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Request Header Parser endpoint
app.get("/api/whoami", function (req, res) {
  res.json({
    ipaddress: req.ip,
    language: req.headers['accept-language'],
    software: req.headers['user-agent']
  });
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});