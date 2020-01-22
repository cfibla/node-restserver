const jwt = require ('jsonwebtoken');


//================
// Verifica TOKEN
//================

let verificaToken = (req, res, next) => {

	let token = req.get('token'); // con req.get se lee los headers

	jwt.verify(token, process.env.SEED, (err, decoded) => {

		if (err) {
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token no validado'
				}
			})
		}

	req.usuario = decoded.usuario;
	next();


	});

}

//======================
// Verifica TOKEN imagen
//======================

let verificaTokenImg = (req, res, next) => {

	let token = req.query.token;

	jwt.verify(token, process.env.SEED, (err, decoded) => {

		if (err) {
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token no validado'
				}
			})
		}

	req.usuario = decoded.usuario;
	next();


	});

}

let verificaAdmin_Role = (req, res, next) => {

	let usuario = req.usuario;

	if (usuario.role === 'ADMIN_ROLE') {
		next();
	} else {
		return res.json({
			ok: false,
			err: {
				message: 'Rol no válido'
			}
		})
	}

}

module.exports = {
	verificaToken,
	verificaAdmin_Role,
	verificaTokenImg
}