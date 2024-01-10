const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbUrl = "mongodb://127.0.0.1:27017/traceabilityApp";
const Core = require("./models/core");
const GT = require("./models/gt");

app.use(bodyParser.json());

// database setup
mongoose.set("strictQuery",true);
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    UseUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// server
app.listen(port, () => console.log(`Listening on port ${port}`));

// test route
app.get("/express_backend", (req, res) => {
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

// core routes
app.get("/core", async (req,res)=>{
  const allCores = await Core.find({});
  res.json(allCores);
})

app.post("/core", async (req,res)=>{
  const newCore = await new Core(req.body);
  newCore.date = new Date();
  await newCore.save();
  res.send("Core added");
})

// gt routes
app.get("/gt", async (req,res)=>{
  const allGts = await GT.find({}).populate({path:"coreNumbers"});
  res.json(allGts);
})

const identifyCores = async (cores) => {
  const identifiedCores = await Promise.all(cores.map( async (core) => {
    let foundCore = await Core.findOne({coreNo:core});
    return foundCore ? foundCore._id : null;
  }));
  return identifiedCores;
}

app.post("/gt", async (req,res)=>{
  const inputData = req.body;
  inputData.coreNumbers = await identifyCores(inputData.coreNumbers);
  inputData.date = new Date();
  const newGT = await new GT(inputData);
  await newGT.save();
  res.send("GT added");
})

app.get("/findgtbycore", async (req,res)=>{
  const coreNo = 5050505050;
  const coreId = await Core.findOne({coreNo});
  const foundGTs = await GT.find({coreNumbers:coreId}).populate("coreNumbers");
  res.json(foundGTs);
})