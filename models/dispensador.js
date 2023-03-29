const mongoose = require('mongoose');

const alarmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
    //names coincidadn con la base
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  servo: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    required: true
},
contador: {
  type: Number,
  required: true,
  default: 0
},
usuario: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'usuario',
  required: true
}
});

const Alarm = mongoose.model('Alarm', alarmSchema);

module.exports = Alarm;
