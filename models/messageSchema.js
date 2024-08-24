import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderName: {
        type: String,  // Specify the type as String
        minlength: [2, "Name must contain at least 2 characters"]  // Use `minlength` instead of `minLength`
    },
    subject: {
        type: String,
        minlength: [2, "Message must contain at least 2 characters"]
    },
    message: {
        type: String,
        minlength: [2, "Message must contain at least 2 characters"]
    },
    createdAt: {
        type: Date,  // Use Date type for createdAt
        default: Date.now
    }
});

export const Message = mongoose.model("Message", messageSchema);
