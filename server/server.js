require ('./config/config');


const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');


//MIDDLEWARES(app.use)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Rutas
app.use(require('./routes/index'));

//CONNEXIÓ BD
mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, (err, res)=> {
	if ( err ) throw err;
	console.log('base de datos CONNECT');
});

app.listen(process.env.PORT, () => {
	console.log('Escuchando en puerto:', process.env.PORT)
})