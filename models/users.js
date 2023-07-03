import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const UsersSchema = new Schema({
    user: { type: String, required: true },
    password: { type: String, required: true }
});

UsersSchema.pre('save', async function(next) {
    if(this.isModified('password') || this.isNew) {
        try {
            const salt = bcrypt.genSalt(12);
            const hashedPassword =  await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
            next();
        } catch(err) {
            console.error(err);
            next(err);
        }
    }
});

export default mongoose.model('Users', UsersSchema);