const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Routes
app.use('/api/auth', authRoutes); // Auth Routes
app.use('/api/movies', movieRoutes); // Movies Routes
app.use('/api/reviews', reviewRoutes); // Reviews Routes

// Starting the server
app.listen(process.env.PORT || 3008, () => {
    console.log('Server is running...');
});
