'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	cedula: String,
	name: String,
	email: String,
	celular: String,
	password: String,
	image: String,
	role: String
});

module.exports = mongoose.model('User', UserSchema);