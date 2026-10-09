const express = require('express');
const cors = require('cors');
const multer = require('multer');

// Configure multer to handle file uploads
const upload = multer({ dest: 'uploads/' });
const app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// Serve HTML form directly so tests can detect the 'upfile' input
app.get('/', function (req, res) {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>File Metadata Microservice</title>
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">
      </head>
      <body style="font-family: Roboto, sans-serif; text-align: center; margin-top: 50px;">
        <h2>API Project: File Metadata Microservice</h2>
        <form action="/api/fileanalyse" method="POST" enctype="multipart/form-data">
          <input id="inputfield" type="file" name="upfile">
          <input id="button" type="submit" value="Upload">
        </form>
      </body>
    </html>
  `);
});

// POST endpoint for file analysis
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  if (!req.file) {
    return res.json({ error: 'Please upload a file' });
  }

  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});