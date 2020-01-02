const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
	values: ['ADMIN_ROLE', 'USER_ROLE'],
	message: '{VALUE} no es un rol válido'
}

let usuarioSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es necesario']
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'El correo es necesario']
	},
	password: {
		type: String,
		required: [true, 'La contraseña es necesaria']
	},
	img: {
		type: String,
		required: [false]
	}, 	// no obligatoria
	role: {
		type: String,
		default: 'USER_ROLE',
		enum: rolesValidos
	},	// default:'USER_ROLE'
	estado: {
		type: Boolean,
		default: true
	},	// boolean
	google: {
		type: Boolean,
		default: false
	}	// boolean
});

// Borrar la contraseña si se imprime por consola
// La funcion no puede ser de flecha porque se necesita el THIS
usuarioSchema.methods.toJSON = function () {
	let user = this;
	let userObject = user.toObject();

	delete userObject.password;
	return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
	message:'{PATH} ya existe en la DB'
});

module.exports = mongoose.model ('Usuario', usuarioSchema);