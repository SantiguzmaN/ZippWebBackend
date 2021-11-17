'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3789;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://Jacc:jacc5466@ds011331.mlab.com:11331/zipp',{ useMongoClient:true }) 
//mongoose.connect('mongodb://basedatoszipp:basedatoszipp2017@ds133816.mlab.com:33816/zipp',{ useMongoClient:true }) 
	.then(() => {
		console.log('La conexión a la base de datos zipp se ha realizado correctamente!');
		
		app.listen(port, () => {
			console.log("El servidor local con Node y Express está corriendo correctamente!")
		});
	})
	.catch(err => console.log(err));