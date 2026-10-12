const express = require('express');
const app = express();

// Enable CORS so that freeCodeCamp can test your API remotely
const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));

// Serve static files if any
app.use(express.static('public'));

// Home route (works without requiring index.html)
app.get('/', (req, res) => {
  res.send('Timestamp Microservice API is running successfully!');
});

// Timestamp API Endpoint
app.get("/api/:date?", (req, res) => {
  let dateString = req.params.date;
  let date;

  // If date parameter is empty, use current date
  if (!dateString) {
    date = new Date();
  } else {
    // Check if dateString is a pure number (Unix timestamp in milliseconds)
    if (!isNaN(dateString)) {
      date = new Date(parseInt(dateString));
    } else {
      date = new Date(dateString);
    }
  }

  // Check if date is valid
  if (date.toString() === "Invalid Date") {
    res.json({ error: "Invalid Date" });
  } else {
    res.json({
      unix: date.getTime(),
      utc: date.toUTCString()
    });
  }
});

// Listen on port set in environment variable or default to 3000
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
