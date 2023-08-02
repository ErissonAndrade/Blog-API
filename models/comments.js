const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { Schema } = mongoose;

const CommentsSchema = new Schema({
  user: { type: String, required: true},
  date: { type: Date, required: true },
  message: { type: String, required: true },
  lastUpdate: { type: Date }
});

CommentsSchema.virtual('date_formatted').get(function () {
  const dateFormatted = DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
  const timeFormatted = DateTime.fromJSDate(this.date).toLocaleString(DateTime.TIME_SIMPLE);
  return `${dateFormatted} ${timeFormatted}`;
});

CommentsSchema.set('toJSON', { virtuals: true });

module.exports =  mongoose.model('Comments', CommentsSchema);