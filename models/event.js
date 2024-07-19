const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  concertName: String,
  location: String,
  address: String,
  city: String,
  date: String,
  time: String,
  ticketPrice: Number,
  imageUrl: String,
  description: String
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
