import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
    title: {
        type: String,  // Specify the type as String
        required:[true ,"title requried"]
    },
    description: {
        type: String,
        required:[true ,"Description requried"]
    },
    timeline: {
        from :{
            type:String,
            required:[true,"timeline starting data is required"]
        },
        to:String
    },
  
});

export const Timeline = mongoose.model("Timeline", timelineSchema);
