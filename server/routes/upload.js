const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require ('../models/usuario');
const Producto = require ('../models/producto');

const fs = require ('fs');
const path = require ('path');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
    	ok: false,
    	err: {
    		message: 'No se ha subido ningún archivo.'
    	}
    });
  }

  //Tipos válidos
  let tipo = req.params.tipo;
  let id = req.params.id;

  let tiposValidos = ['productos', 'usuarios'];

  if (tiposValidos.indexOf(tipo) < 0) {
  	return res.status(400).json({
  		ok: false,
  		err: {
  			message:'Tipos válidos: ' + tiposValidos.join(', ')
  		}
  	});

  }

  //Exensiones válidas
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo;

  let nombreCortado = archivo.name.split('.');
  let extension = nombreCortado[nombreCortado.length - 1];
  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  if(extensionesValidas.indexOf(extension) < 0) {
  	return res.status(400).json({
  		ok: false,
  		err: {
  			message:'Extensiones válidas: ' + extensionesValidas.join(', ')
  		}
  	});
  }

  //Cambiar el nombre al archivo para que no se solape con otro
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if(tipo === 'usuarios') {

			imagenUsuario(id, res, nombreArchivo);

		} else {
			
			imagenProducto(id, res, nombreArchivo);
		}

		
  })
});

function imagenUsuario (id, res, nombreArchivo) {

	Usuario.findById(id, (err, usuarioDB) => {

		if (err) {
			borraArchivo(nombreArchivo, 'usuarios');
			return res.status(500).json({
			ok:false,
			err
			});
		}
		
		if (!usuarioDB) {
			borraArchivo(nombreArchivo, 'usuarios');
			return res.status(400).json({
			ok:false,
			err: {
				message: 'Usuario no existe'
			}
			});
		}
//borra la antigua imagen
		borraArchivo(usuarioDB.img, 'usuarios');
//actualiza la imagen en la DB
		usuarioDB.img = nombreArchivo;

		usuarioDB.save((err, usuarioGuardado) => {
			if(err){
				res.json(err)
			}

			res.json({
				ok:true,
				usuario: usuarioGuardado,
				img: nombreArchivo
			});
		}); 
		
	})
}


function imagenProducto (id, res, nombreArchivo) {

	Producto.findById(id, (err, productoDB) => {

		if (err) {
			borraArchivo(nombreArchivo, 'productos');
			return res.status(500).json({
			ok:false,
			err
			});
		}
		
		if (!productoDB) {
			borraArchivo(nombreArchivo, 'productos');
			return res.status(400).json({
			ok:false,
			err: {
				message: 'Producto no existe'
			}
			});
		}
//borra la antigua imagen
		borraArchivo(productoDB.img, 'productos');
//actualiza la imagen en la DB
		productoDB.img = nombreArchivo;

		productoDB.save((err, productoGuardado) => {
			if(err){
				res.json(err)
			}

			res.json({
				ok:true,
				producto: productoGuardado,
				img: nombreArchivo
			});
		}); 
		
	})
}


function borraArchivo(nombreImagen, tipo) {

	let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

	if (fs.existsSync(pathImagen)) {
		fs.unlinkSync(pathImagen);
	}

}

module.exports = app;