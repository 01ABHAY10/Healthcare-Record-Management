const express = require("express");
const { Web3Storage } = require("web3.storage");
const { File } = require("web3.storage");
const https = require("https");
const { spawn } = require("child_process");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');


const { KEY } = require("./config.js");
const { MONGO_URL } = require("./config.js");
const { ID } = require("./config.js");
// const { log } = require("console");


const app = express();
const client = new Web3Storage({ token: KEY });
const python = spawn("python", ["main.py"]);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//starting server at port
app.listen(8000, function(){
  console.log("Server listening on port 8000...");
});



//connect database function
async function ConnectDB(){
  try{
    await mongoose.connect(MONGO_URL);
    console.log("Database in connected...");
  }catch(error){
    console.log("Error while connecting database...");
  }
}
ConnectDB();


//get latest filename
async function getFilename(){
  try{
      const latest = await ID.findOne().sort({id : -1}).exec();
      const fileNo = (latest.id) + 1;
      return fileNo;
  }catch(error){
      return -1;
  }
}

//upload patient data to web3 storage 
async function upload(obj,filename) {
  const buffer = Buffer.from(JSON.stringify(obj));
  const file = [new File([buffer], filename)];
  const cid = await client.put(file);
  console.log("Data stored with CID : " + cid);
  return cid;
}

//Data retrieve from web3 storage
async function Retrieve(id, cid) {
  const url = "https://ipfs.io/ipfs/" + cid + "/" + id + ".json";
  https.get(url, function (response) {
    response.on("data", function (data) {
      const obj = JSON.parse(data);
      console.log(obj);


      // sending obj to main.py
      python.stdin.write(JSON.stringify(obj));
      python.stdin.end();

      // listen for response from Python process
      python.stdout.on("data", (data) => {
        console.log("Received data from Python:", data.toString());
      });

      // handle errors and exit events
      python.on("error", (err) => {
        console.error("Python process error:", err);
      });

      python.on("exit", (code) => {
        console.log("Python process exited with code:", code);
      });
    });
  });
}



//  upload();
Retrieve(
  "trial",
  "bafybeicw5nzz3fgqhlhw36a2sin62i6rqiidesegirdo4si44dgy7w53ry"
);
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.post("/patient-data",async function(req,res){
  const {name,age,gender,blood_group,height,weight,smoke,drink,tobacco,date,email} = req.body;

  //creating patient object
const patient = {
  Data_Uploading_Date : date,
  Email : email,
  Name : name,
  Age : age,
  Gender : gender,
  Blood_Group : blood_group,
  Height : height,
  Weight : weight,
  Smoking : smoke ? "Yes" : "No",
  Drinking : drink ? "Yes" : "No",
  Tobacco : tobacco ? "Yes" : "No"
}

const id = await getFilename();
const filename = id+'.json';
const cid = await upload(patient,filename);


try{
    const report = await ID.create({id,cid,email});
    res.status(200).json({ success: true, message: "Data stored successfully" });
}catch(error){
    console.log("Error on storing data...");
    res.status(500).json({ success: false, message: "Error storing data" });
  }
});



