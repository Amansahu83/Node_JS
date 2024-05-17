const mongoose = require('mongoose');
const express = require('express');
const User = require('./model/user');
const userController=require('./Controller/userController');
const router=require('./Routes/Routes');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://amangupta83a:kj5qrKKDgkxs1ZZk@cluster0.myjnwsh.mongodb.net/student?retryWrites=true&w=majority')
  .then((conn) => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.error(err);
  });

// Middleware to parse JSON
app.use(express.json()); 
app.use('/',router);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server has started...');
});
