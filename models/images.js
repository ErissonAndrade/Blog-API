import mongoose from 'mongoose';

const { Schema } = mongoose;

const ImagesSchema = new Schema({
    image: {type: Buffer, required: true},
    name: {type: String, required: true}
});

ImagesSchema.virtual('imageURL').get(function() {
    return `data:image/jpeg;base64,${this.image.toString('base64')}`;
});

ImagesSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Images', ImagesSchema);