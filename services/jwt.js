'use strict' // para poder utilizar nuevas reglas y nuevas funcionalidades de javascript

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'zipp_componente_web_user';

exports.createToken = function(user){
	var payload = {
		sub: user._id,
		cedula: user.cedula,
		name: user.name,
		email: user.email,
		celular: user.celular,
		role: user.role,
		image: user.image,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix
	};

	return jwt.encode(payload, secret);

}; 