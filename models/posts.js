const mongoose = require('mongoose');
const { DateTime }  = require('luxon');

const { Schema } = mongoose;

const PostsSchema = new Schema({
    title: {type: String, required: true},
    date: { type: Date, required: true},
    text: { type: String, required: true},
    images: [{ type: Schema.Types.ObjectId, ref: 'Images'}],
    lastUpdate: { type: Date},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments'}]
});

PostsSchema.virtual('date_formatted').get(function() {
    const dateFormatted = DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
    const timeFormatted = DateTime.fromJSDate(this.date).toLocaleString(DateTime.TIME_SIMPLE);
    return `${dateFormatted} ${timeFormatted}`
});

PostsSchema.virtual('url').get(function() {
    return `/posts/${this._id}`;
});

PostsSchema.virtual('preview').get(function () {
    const words = this.text.split(' ');
    const previewWords = words.slice(0, 15);
    return `${previewWords.join(' ')} ...`;
});

PostsSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Posts', PostsSchema);




