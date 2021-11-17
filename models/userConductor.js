'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserConductorSchema = Schema({
	cedula: String,
	name: String,
	email: String,
	celular: String,
	password: String,
	image: String,
	role: String,
	ciudad: String,
	estado: Boolean
});

module.exports = mongoose.model('UserConductor', UserConductorSchema);