const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    createdBy: {
        type:String,
        required: true
    },
    createdAt:{
        type:Date,
        required:true,
        default: Date.now
    },
    status:{
        type:String,
        enum:["planned","ongoing","completed"],
        default:"planned"
    }
});

const Task = mongoose.model("Task",taskSchema);

module.exports = Task;