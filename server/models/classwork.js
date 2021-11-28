const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassworkSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    class: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Class"
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    points:
    {
        type: Number,
        default:100
    },
    types: {
        type: String,
        required: true,
        enum: ['material', 'announcement', 'assignment']
    },
    attachment:{
        type:Object
    },
    answer: {
        type: Array
    },
    duedate: {
        type: Date,
        required: false,
    },
    options: {
        type: Array,
        required: false
    }
}, {
    timestamps: true
})

const Classwork = mongoose.model("Classwork", ClassworkSchema);

module.exports = Classwork;