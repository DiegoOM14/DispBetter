const mongoose = require('mongoose');

//const plotly = require('plotly.js');
//se puede mandar esa uri en una env key para mas seguridad pero ya despuesito xd

const connectMongoDB = () => {
    //esta se saca de mongo db al crear una cuenta y un cluster,nose por que la nombre test lmao u-u
    const linkMongoDB = "mongodb+srv://teban:teban@cluster0.2vvboa7.mongodb.net/?retryWrites=true&w=majority"
    
    mongoose.set('strictQuery', false);
    mongoose.connect(linkMongoDB)
    .then(() => {
        console.log('Conectado a mongoDB');
    })
    .catch((e)=>{
        console.log('Error en la conexion a mongoDb'+e);
    });
}

module.exports = connectMongoDB;