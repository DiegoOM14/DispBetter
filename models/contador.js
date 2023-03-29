const mongoose = require('mongoose');

const contadorSchema = new mongoose.Schema({
  fecha_hora: {
    type: Date,
    required: true
  },
  imagen: {
    type: Buffer,
    required: true
  }
});

const Contador = mongoose.model('Contador', contadorSchema);

module.exports = Contador;