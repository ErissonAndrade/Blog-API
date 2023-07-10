import mongoose from 'mongoose';

const { Schema } = mongoose;

const ImagesSchema = new Schema({
    image: {type: Buffer, required: true},
    name: {type: String, required: true}
});

export default mongoose.Model('Images', ImagesSchema);