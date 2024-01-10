const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gtSchema = new Schema({
    date:Date,
    operatorId:Number,
    cableId:Number,
    producedLength:Number,
    coreNumbers:[{
        type:Schema.Types.ObjectId,
        ref:"Core"
    }]
})

module.exports = mongoose.model("GT", gtSchema);