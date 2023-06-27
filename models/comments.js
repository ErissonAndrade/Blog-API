import mongoose from 'mongoose';
import { DateTime } from 'luxon';

const { Schema } = mongoose;

const CommentsSchema = new Schema({
  user: { type: String, required: true},
  title: { type: String },
  date: { type: Date, required: true },
  message: { type: String, required: true },
});

CommentsSchema.virtual('date_formatted').get(function () {
  const dateFormatted = DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
  const timeFormatted = DateTime.fromJSDate(this.date).toLocaleString(DateTime.TIME_SIMPLE);
  return `${dateFormatted} ${timeFormatted}`;
});

export default mongoose.model('Comments', CommentsSchema);