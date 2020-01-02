//PORT
process.env.PORT = process.env.PORT || 3000;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {

	urlDB = 'mongodb://localhost:27017/cafe'

} else {

	urlDB = 'mongodb+srv://cfibla:fmZrFTom5vGcaAOs@cluster0-gkpgk.mongodb.net/cafe'

}

process.env.URLDB = urlDB;