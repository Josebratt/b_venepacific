const express = require('express');
const cors = require('cors');
require('dotenv').config();

app = express();

/** define the Db conection */
const { dbConnect } = require('./database/mongo');

/**  Middlewares */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** define routes */
app.use('/api/v1', require('./app/routes'));

/** excecute the conection */
dbConnect();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en http://localhost:${PORT}`);
});