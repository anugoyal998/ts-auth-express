import mongoose from "mongoose";
const Schema = mongoose.Schema

const userSchema = new Schema({
    providers: [{
        provider: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        profilePhotoURL: {
            type: String,
            required: true
        },
        isEmailPassword: {
            type: Boolean,
            required: true
        },
        password: {
            type: String,
            required: false
        }
    }],
    username: {
        type: String,
        required: true
    },
}, { timestamps: true})

export default mongoose.model('User',userSchema)

