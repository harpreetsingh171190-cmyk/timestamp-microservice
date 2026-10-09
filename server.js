const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// In-memory arrays to store users and exercises
let users = [];
let exercises = [];

// 1. Create a new user
app.post('/api/users', (req, res) => {
  const username = req.body.username;
  if (!username) {
    return res.json({ error: 'Username is required' });
  }
  const newUser = {
    username: username,
    _id: Date.now().toString()
  };
  users.push(newUser);
  res.json(newUser);
});

// 2. Get a list of all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// 3. Add an exercise to a user
app.post('/api/users/:_id/exercises', (req, res) => {
  const userId = req.params._id;
  const user = users.find(u => u._id === userId);

  if (!user) {
    return res.json({ error: 'User not found' });
  }

  const description = req.body.description;
  const duration = parseInt(req.body.duration);
  let date = req.body.date ? new Date(req.body.date) : new Date();

  if (date.toString() === "Invalid Date") {
    date = new Date();
  }

  const exerciseObj = {
    userId: userId,
    description: description,
    duration: duration,
    date: date.toDateString()
  };

  exercises.push(exerciseObj);

  res.json({
    username: user.username,
    description: description,
    duration: duration,
    date: date.toDateString(),
    _id: user._id
  });
});

// 4. Retrieve a full exercise log of any user with optional from, to, and limit
app.get('/api/users/:_id/logs', (req, res) => {
  const userId = req.params._id;
  const user = users.find(u => u._id === userId);

  if (!user) {
    return res.json({ error: 'User not found' });
  }

  let userExercises = exercises.filter(e => e.userId === userId);

  const { from, to, limit } = req.query;

  if (from) {
    const fromDate = new Date(from);
    userExercises = userExercises.filter(e => new Date(e.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    userExercises = userExercises.filter(e => new Date(e.date) <= toDate);
  }

  if (limit) {
    userExercises = userExercises.slice(0, parseInt(limit));
  }

  res.json({
    username: user.username,
    count: userExercises.length,
    _id: user._id,
    log: userExercises.map(e => ({
      description: e.description,
      duration: e.duration,
      date: e.date
    }))
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});