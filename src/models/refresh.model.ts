import mongoose from "mongoose";
const Schema = mongoose.Schema

const refreshSchema = new Schema({
    token: {
        required: true,
        type: String
    }
}, { timestamps: true })

export default mongoose.model('Refresh',refreshSchema)