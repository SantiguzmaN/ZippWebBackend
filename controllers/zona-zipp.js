'use strict'

// modulos
var fs = require('fs');
var path = require('path');

// modelos
var User = require('../models/user');
var ZonaZipp = require('../models/zona-zipp');
var ReservaZipp = require('../models/reserva-zipp');

// acciones

// Metodo para guardar las zonas ZIPP
function saveZonaZipp(req, res){
	var zonazipp = new ZonaZipp();
	var params = req.body;

	if(params.address){
		zonazipp.city = params.city;
		zonazipp.address = params.address;
		zonazipp.number_spaces = params.number_spaces;
		zonazipp.price = params.price;

		zonazipp.big_type =  params.big_type,
		zonazipp.medium_type =  params.medium_type,
		zonazipp.small_type =  params.small_type,

		zonazipp.electric_station = params.electric_station,
		zonazipp.leave_key = params.leave_key,
		zonazipp.total_hours_day = params.total_hours_day,
		zonazipp.cctv = params.cctv,
		zonazipp.phone = params.phone,
		zonazipp.roofed = params.roofed,
		zonazipp.security_guard = params.security_guard,
		
		zonazipp.car_type= params.car_type,
		zonazipp.motorcycle_type = params.motorcycle_type,
		zonazipp.bike_type = params.bike_type,	

		zonazipp.image_zona_zipp = null;
		zonazipp.image_bill = null;
		zonazipp.horary = params.horary;
		zonazipp.estado_zonazipp = params.estado_zonazipp;
		zonazipp.lat = params.lat;
		zonazipp.lng = params.lng;		
		zonazipp.description = params.description;
		zonazipp.score = params.score;
		zonazipp.user = req.user.sub;

		zonazipp.save((err, zonazippStored) => {
			if(err){
				res.status(500).send({message: 'Error en el servidor'});
			}else{
				if (!zonazippStored) {
					res.status(404).send({message: 'No se ha guardado la zona zipp'});
				}else{
					res.status(200).send({zonazipp: zonazippStored});
				}
			}
		});
	}else{
		res.status(200).send({
			message: 'La dirección es obligatoria'
		});
	}
}


// Metodo para obtener todas las zonas ZIPP
function getZonasZipp(req, res){


	ZonaZipp.find({}).exec((err, zonaszipp) => {
		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		}else{
			if(!zonaszipp){
				res.status(404).send({
					message: 'No hay zonas zipp'
				});
			}else{
				res.status(200).send({zonaszipp});
			}
		}
	});
}

// Metodo para obtener todas las zonas ZIPP discriminadas por usuario

function getZonasZippByUser(req, res){
	var userZonazippId = req.params.id;
	console.log(userZonazippId);
	ZonaZipp.find({"user":  userZonazippId}).exec((err, zonaszipp) => {
		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		}else{
			if(!zonaszipp){
				res.status(404).send({
					message: 'No hay zonas zipp'
				});
			}else{
				res.status(200).send({zonaszipp});
			}
		}
	});
}


// Metodo para hacer el historial de uso de las zonas ZIPP por usuario

function getRecordZonasZipp(req, res){
	var userRecordZonaZipp = req.params.id;
	console.log(userRecordZonaZipp);
	ReservaZipp.find({"userzonazipp":  userRecordZonaZipp}).exec((err, reservazonas) => {

		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		}else{
			if(!reservazonas){
				res.status(404).send({
					message: 'No hay zonas zipp utilizadas'
				});
			}else{
				res.status(200).send({reservazonas});
			}
		}
	});
}


// Metodo para obtener una sola zona ZIPP
function getZonaZipp(req, res){
	var zonazippId = req.params.id;

	ZonaZipp.findById(zonazippId).populate({path: 'user'}).exec((err, zonazipp) => {
		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		}else{
			if(!zonazipp){
				res.status(404).send({
					message: 'La zona zipp no existe'
				});
			}else{
				res.status(200).send({zonazipp});
			}
		}
	});
}

// Metodo para actualizar una zona ZIPP
function updateZonaZipp(req, res){
	var zonazippId = req.params.id;
	var update = req.body;

	ZonaZipp.findByIdAndUpdate(zonazippId, update, {new:true}, (err, zonazippUpdated) => {
		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		}else{
			if(!zonazippUpdated){
				res.status(404).send({
					message: 'No se ha actualizado la zona zipp'
				});
			}else{
				res.status(200).send({zonazipp: zonazippUpdated});
			}
		}
	});
}

// Metodo para cambiar y actualizar la imagen de la zona zipp
function uploadImageZonaZipp(req, res){
	var zonazippId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		var file_path = req.files.image_zona_zipp.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' || file_ext == 'PNG'){

			ZonaZipp.findByIdAndUpdate(zonazippId, {image_zona_zipp: file_name},  {new:true}, (err, zonazippUpdated) => {
				if(err){
					res.status(500).send({
						message:'Error al actualizar la zonazipp'
					});
				}else{
					if(!zonazippUpdated){
						res.status(404).send({
							message:'No se ha podido actualizar la zona zipp'
						});
					}else{
						res.status(200).send({zonazipp: zonazippUpdated, image_zona_zipp: file_name});
					}
				}
			});


		}else{
			fs.unlink(file_path, (err) => {
				if(err){
					res.status(200).send({message: 'Extención no valida y fichero no borrado'});
				}else{
					res.status(200).send({message: 'Extención no valida'});
				}
			});
		}

	}else{
		res.status(200).send({
			message: 'No se han subido ficheros'
		});
	}
}

// Metodo para obtener la imagen de una zona ZIPP
function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/zonaszipp/'+imageFile;

	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({
				message: 'La imagen no existe'
			});
		}
	}); 
}

// Metodo para subir la imagen de la factura de servicio publico de la zona ZIPP
function uploadImageZonaZippBill(req, res){
	var zonazippbillId = req.params.id;
	var file_name_bill = 'No subido...';

	if(req.files){
		var file_path = req.files.image_bill.path;
		var file_split = file_path.split('\\');
		var file_name_bill = file_split[2];

		var ext_split = file_name_bill.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' || file_ext == 'PNG'){

			ZonaZipp.findByIdAndUpdate(zonazippbillId, {image_bill: file_name_bill},  {new:true}, (err, zonazippbillUpdated) => {
				if(err){
					res.status(500).send({
						message:'Error al actualizar la zonazipp'
					});
				}else{
					if(!zonazippbillUpdated){
						res.status(404).send({
							message:'No se ha podido actualizar la factura de la zona ZIPP'
						});
					}else{
						res.status(200).send({zonazipp: zonazippbillUpdated, image_bill: file_name_bill});
					}
				}
			});


		}else{
			fs.unlink(file_path, (err) => {
				if(err){
					res.status(200).send({message: 'Extención no valida y fichero no borrado'});
				}else{
					res.status(200).send({message: 'Extención no valida'});
				}
			});
		}

	}else{
		res.status(200).send({
			message: 'No se han subido ficheros'
		});
	}
}

// Metodo para obtener la imagen de una zona ZIPP
function getImageFileBill(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/bills/'+imageFile;

	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({
				message: 'La imagen no existe'
			});
		}
	}); 
}

// Metodo para borrar una zona ZIPP
function deleteZonaZipp(req, res){
	var zonazippId = req.params.id;

	ZonaZipp.findByIdAndRemove(zonazippId, (err, zonazippRemoved) => {
		if(err){
			res.status(500).send({
				message:'Error en la petición'
			});
		}else{
			if(!zonazippRemoved){
				res.status(404).send({
					message:'No se ha podido borrar la zona zipp'
				});
			}else{
				res.status(200).send({zonazipp: zonazippRemoved});
			}
		}
	});
}


// Exportar metodos
module.exports = {
	saveZonaZipp,
	getZonasZipp,
	getZonasZippByUser,

	getRecordZonasZipp,

	getZonaZipp,
	updateZonaZipp,

	uploadImageZonaZipp,
	getImageFile,

	uploadImageZonaZippBill,
	getImageFileBill,

	deleteZonaZipp
};