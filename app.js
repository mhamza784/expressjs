const dotenv = require ('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const app = express();


dotenv.config({ path: "./config.env"});
require('./db/conn');


app.use(express.json());
// we link the routers file to make our route easy
app.use(require("./router/auth"));

const port= process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello World!')
});


         // Middleware
const middleware=(req, res, next)=>{
console.log("hello my middleware");
next();
}

app.get('/about',  middleware, (req, res) => {
  res.send('about!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})