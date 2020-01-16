const express = require('express');
const{ verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const _ = require('underscore');
let app = express();
let Producto = require('../models/producto');

//CRUD

// ===================================
// Buscar todos los productos
// ===================================

app.get('/productos', verificaToken, (req, res) => {

	let desde = req.query.desde || 0;
	desde = Number(desde);

	let limite = req.query.limite || 10;
	limite = Number(limite);
  
	Producto.find({disponible:true})
		.skip(desde)
		.limit(limite)
		.populate('usuario categoria')
		.exec((err, productos) => {
			if(err){
				return res.status(500).json({
					ok:false,
					err
				})
			}

			res.json({
				ok: true,
				productos
			});

		})
})

// ===================================
// Buscar un producto por ID
// ===================================
 
app.get('/productos/:id', verificaToken, (req, res) => {

	let id = req.params.id;
 
	Producto.findById(id)
		.populate('usuario', 'nombre email')
		.populate('categoria', 'descripcion')
		.exec((err, productoDB) => {
			if(err){
				return res.status(500).json({
					ok:false,
					err
				})
			}

			if(!productoDB){
				return res.status(400).json({
					ok:false,
					err:{
						message:'El ID no es correcto'
					}
				})
			}

			res.json({
				ok: true,
				productoDB
			});

		})
})

// ===================================
// Buscar un producto por nombre
// ===================================
 
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

	let termino = req.params.termino;
	let regex = new RegExp(termino, 'i');
 
	Producto.find({nombre: regex})
		.populate('categoria', 'descripcion')
		.exec((err, productoDB) => {
			if(err){
				return res.status(500).json({
					ok:false,
					err
				})
			}

			if(!productoDB){
				return res.status(400).json({
					ok:false,
					err:{
						message:'El ID no es correcto'
					}
				})
			}

			res.json({
				ok: true,
				productoDB
			});

		})
})

// ===================================
// Crear un nuevo producto
// ===================================

app.post('/productos', verificaToken, function (req, res) {
	let body = req.body;

	let producto = new Producto({

		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		disponible: body.disponible,
		categoria: body.categoria,
		usuario: req.usuario._id

	});


	producto.save((err, productoDB) => {

		if(err){
			return res.status(500).json({
				ok:false,
				err
			})
		}

		if(!productoDB){
			return res.status(400).json({
				ok:false,
				err
			})
		}

		res.json({
			ok: true,
			producto: productoDB
		})
	})

})

// ===================================
// Modificar un producto
// ===================================

app.put('/productos/:id', [verificaToken, verificaAdmin_Role], function (req, res) {

	let id = req.params.id;
	let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario']);
	
	Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err,productoDB) =>{
		if(err){
			return res.status(400).json({
				ok: false,
				err
			})
		}

		if(!productoDB){
			return res.status(400).json({
				ok:false,
				err
			})
		}

		res.json({
			ok: true,
			producto: productoDB
		})
	})
})

// ===================================
// Eliminar un producto
// ===================================

app.delete('/productos/:id', [verificaToken, verificaAdmin_Role], function (req, res) {

	let id = req.params.id;

	Producto.findByIdAndUpdate(id, {disponible: false}, {new: true}, (err, productoBorrado) => {

		if(err){
			return res.status(400).json({
				ok: false,
				err
			})
		}

		if(!productoBorrado){
			return res.status(400).json({
				ok: false,
				err: {
					message: 'Producto no encontrado'
				}
			});
		}

		res.json({
			ok: true,
			message: 'Producto borrado'
		});


	});
})




module.exports = app;