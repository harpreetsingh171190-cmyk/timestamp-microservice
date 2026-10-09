const express = require('express');
const cors = require('cors');
const dns = require('dns');
const urlparser = require('url');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// In-memory database to store URLs
let urls = [];
let idCounter = 1;

// POST endpoint to shorten URL
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  // Validate URL format
  const parsedUrl = urlparser.parse(originalUrl);
  if (!parsedUrl.protocol || !parsedUrl.hostname) {
    return res.json({ error: 'invalid url' });
  }

  // Verify URL using dns.lookup
  dns.lookup(parsedUrl.hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    } else {
      const shortUrl = idCounter++;
      urls.push({ original_url: originalUrl, short_url: shortUrl });
      res.json({ original_url: originalUrl, short_url: shortUrl });
    }
  });
});

// GET endpoint to redirect to original URL
app.get('/api/shorturl/:short_url', function(req, res) {
  const short = parseInt(req.params.short_url);
  const found = urls.find(u => u.short_url === short);
  
  if (found) {
    res.redirect(found.original_url);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

const listener = app.listen(process.env.PORT || 3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});