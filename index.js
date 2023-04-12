const express = require("express");
const { Web3Storage } = require("web3.storage");
const { File } = require("web3.storage");
const https = require("https");
const { spawn } = require("child_process");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
const { KEY } = require("./config.js");
const { MONGO_URL } = require("./config.js");
const { ID } = require("./config.js");
// const { log } = require("console");


const app = express();
const client = new Web3Storage({ token: KEY });
const python = spawn("python", ["main.py"]);


app.use(express.static("public"));
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
async function retrieve(id) {
  try{
     const key = await ID.findOne({id : id});
     const cid = key.cid;
     const url = "https://ipfs.io/ipfs/" + cid + "/" + id + ".json";
     const data = await new Promise(function(resolve,reject){
      https.get(url, function (response) {
        response.on("data", function (data) {
           const obj = JSON.parse(data);
          resolve(obj);
     })
     })
    })
    return data;
  }catch(error){
     console.log("Invalid id");
     return -1;
  }
}

//       // sending obj to main.py
//       python.stdin.write(JSON.stringify(obj));
//       python.stdin.end();

//       // listen for response from Python process
//       python.stdout.on("data", (data) => {
//         console.log("Received data from Python:", data.toString());
//       });

//       // handle errors and exit events
//       python.on("error", (err) => {
//         console.error("Python process error:", err);
//       });

//       python.on("exit", (code) => {
//         console.log("Python process exited with code:", code);
//       });
//     });
//   });
// }

// bafybeicw5nzz3fgqhlhw36a2sin62i6rqiidesegirdo4si44dgy7w53r;

//  upload();
// Retrieve(
//   "trial",
//   "bafybeicw5nzz3fgqhlhw36a2sin62i6rqiidesegirdo4si44dgy7w53ry"
// );
// app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

let Doc_ID_No;

app.post("/patient-data",async function(req,res){
  
  const {name,age,gender,blood_group,height,weight,smoke,drink,tobacco,date,email,
    covid,disease1,disease2,disease3,disease4,disease5,disease6,other} = req.body;

  const id = await getFilename();
  

//creating patient object
const patient = {
  Doc_ID : id,
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
  Tobacco : tobacco ? "Yes" : "No",
  Disease_1 : disease1,
  Disease_2 : disease2,
  Disease_3 : disease3,
  Disease_4 : disease4,
  Disease_5 : disease5,
  Disease_6 : disease6,
  Covid_Vaccination_Status : covid,
  Other_problems_or_symptoms : other
}

const filename = id+'.json';
const cid = await upload(patient,filename);


try{
    const report = await ID.create({id,cid,email});
      Doc_ID_No = {
       ID : id
     };
}catch(error){
    console.log("Error on storing data...");
    
       Doc_ID_No = {
        ID : false
      };
  }
});

app.get('/upload', function(req, res) {
  res.sendFile(__dirname + "/upload.html");
});

app.get("/update",function(req,res){
 res.header('Content-Type','application/json');
 res.send(Doc_ID_No);
});

let patient_data;
app.post("/view-data",async function(req,res){
  const ID= req.body.id;
  console.log(ID);
  patient_data = await retrieve(ID);
  if(patient_data == -1){
    patient_data = {
      Doc_ID : -1
    }
  }else{
    res.sendFile(__dirname + "/view.html");
  }
})


app.get("/data",function(req,res){
  res.header('Content-Type','application/json');
  res.send(patient_data);
})


app.get('/signup',function(req,res){
  res.sendFile(__dirname+"/signup.html");

})

app.post("/signup", function(req, res){
  // res.sendFile(__dirname+"/signup.html");
  const userEmail = req.body.email;
  console.log(userEmail);
  // var verificationToken = generateToken();

  // Send the verification email
  // sendVerificationEmail(userEmail, verificationToken);

  // Prompt the user to check their email for the verification link
  // alert(
  //   "A verification link has been sent to your email. Please click the link to complete registration."
  // );rs
});

// function generateToken() {
//   // Generate a random token using a library like CryptoJS
//   var token = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);

//   // Store the token in the database, associated with the user's email address

//   // Return the token
//   console.log(token);
//   return token;
// }

// // Email sending function
// function sendVerificationEmail(email) {
//   // Construct the verification URL using the token and your application's base URL
//   // var verifyUrl =
//   //   "https://abhinav-21.github.io/Healthcare-Record-Management/verify-email?token=" +
//   //   token;

//   // Construct the email message with the verification URL
//   // const emailBody =
//   //   "Thank you for registering with our application. Please paste the following token to verify your email address and complete registration: " +
//   //   token;

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'healthcare.record.management@gmail.com',
//         pass: 'hrm@12345'
//       }
//     });
//   const mailOptions = {
//     from: "healthcare.record.management@gmail.com",
//     to: email, 
//     subject: "Test Email from Nodemailer",
//     text: "hello",
//   };
//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent: " + info.response);
//     }
//   });
// }

// sendVerificationEmail('babujames0007@gmail.com');


