import mongoose from "mongoose";

const courseProgramSchema = new mongoose.Schema({
    userId: {type:String,required:true},
    courseId: {type:String,required:true},
    completed: {type:Boolean,required:false},
    userId: {type:String,required:true},
    lectureCompleted: []
},{minimize: false});

export const CourseProgress = mongoose.model('CourseProgress',courseProgramSchema)