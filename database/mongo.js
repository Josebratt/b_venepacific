const mongoose = require("mongoose");

const dbConnect = () => {
  const DB_URL = process.env.DB_URL;
  mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, (err, res) => {
    if (!err) {
        console.log('== Connection to DB success  ==');
    } else {
        console.log('== Connection to DB failure ==');
    }
  });
};

module.exports = { dbConnect };