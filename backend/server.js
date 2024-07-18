const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/notesapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
