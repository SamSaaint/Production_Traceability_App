const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coreSchema = new Schema({
    date:Date,
    operatorId:Number,
    coreNo:Number,
    producedLength:Number,
    color:String
})

module.exports = mongoose.model("Core", coreSchema);