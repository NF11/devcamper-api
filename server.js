const express = require('express');
const dotenv = require('dotenv');

//route files
const bootcamps = require('./routes/bootcamps');

// load config
dotenv.config({ path: './config/config.env' });

const app = express();

//mounte router
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}! in ${process.env.NODE_ENV} mode`);
});
