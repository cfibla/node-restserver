//PORT
process.env.PORT = process.env.PORT || 3000;

//CADUCIDAD TOKEN
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//SEED
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {

	urlDB = 'mongodb://localhost:27017/cafe'

} else {

	urlDB = process.env.MONGO_URI;

}

process.env.URLDB = urlDB;

//GOOGLE CLIENT_ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '964353103398-75g4l0mdn9cbu79ohip73fcr3arrfmpk.apps.googleusercontent.com';