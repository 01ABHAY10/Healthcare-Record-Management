const express = require("express");
const nodemailer = require("nodemailer");
const { Web3Storage } = require("web3.storage");
const { File } = require("web3.storage");
const https = require("https");
const { spawn } = require("child_process");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const CryptoJS = require("crypto-js");
const cron = require("node-cron");
const { KEY } = require("./config.js");
const { MONGO_URL } = require("./config.js");
const { ID } = require("./config.js");
const { AdminKey } = require("./config.js");
const { MAILJET_KEY,MAILJET_SECRET_KEY } = require("./config.js");
const mailjet = require('node-mailjet');
const connection = mailjet.connect(MAILJET_KEY, MAILJET_SECRET_KEY);
const { sendDataToPy } = require("./gendata.js");



const app = express();
const client = new Web3Storage({ token: KEY });



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


      // sending obj to main.py
//       python.stdin.write(JSON.stringify(obj));
//       python.stdin.end();

      // listen for response from Python process
//       python.stdout.on("data", (data) => {
//         console.log("Received data from Python:", data.toString());
//       });

      // handle errors and exit events
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


//mainpage get request
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});


//upload data to web3.storage
let Doc_ID_No;
app.post("/patient-data",async function(req,res){
  
  const {name,age,gender,blood_group,height,weight,smoke,drink,tobacco,date,email,
    covid,disease1,disease2,disease3,disease4,disease5,disease6,other} = req.body;

  const id = await getFilename();
  

//creating patient object
const patient = {
  Doc_ID: id,
  Data_Uploading_Date: date,
  Email: email,
  Name: name,
  Age: age,
  Gender: gender,
  Blood_Group: blood_group,
  Height: height,
  Weight: weight,
  Smoking: smoke ? "Yes" : "No",
  Drinking: drink ? "Yes" : "No",
  Tobacco: tobacco ? "Yes" : "No",
  Disease_1: "" ? disease1 : "-",
  Disease_2: "" ? disease2 : "-",
  Disease_3: "" ? disease3 : "-",
  Disease_4: "" ? disease4 : "-",
  Disease_5: "" ? disease5 : "-",
  Disease_6: "" ? disease6 : "-",
  Covid_Vaccination_Status: covid,
  Other_problems_or_symptoms: other,
};

const filename = id+'.json';

try{
    const cid = await upload(patient,filename);
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



// key verification while uploading data
let present;
app.post('/upload', async function(req, res){
  const key = req.body.key;
  console.log(key);
  try{
       present = await AdminKey.findOne({key : key});
    if(present != null){
        res.sendFile(__dirname + "/upload.html");
    }else{
      present = {
        key : 0
      }
    }
  }catch(error){
    present = {
      key : -1
    }
    console.log("Error in key verification")
  }
});


//Sending type of error to client side while verifying key
app.get("/verify-key",function(req,res){
  res.header('Content-Type','application/json');
  res.send(present);
});


//Sernding patient data stored with Doc_ID
app.get("/update",function(req,res){
 res.header('Content-Type','application/json');
 res.send(Doc_ID_No);
});


//Token verification while viewing patient data
let patient_data;
let TOKEN;
app.post("/view-data",async function(req,res){
  const ID= req.body.id;
  const token = req.body.token;
  // console.log(ID);
  // console.log(token);
  if(token == TOKEN){
    patient_data = await retrieve(ID);
    if(patient_data == -1){
      patient_data = {
        Doc_ID : -1
      }
    }else{
      res.sendFile(__dirname + "/view.html");
    }
  }else{
    patient_data = {
      Doc_ID : 0
    }
  }
})


//Sending type of error in client side while verifying token
app.get("/data",function(req,res){
  res.header('Content-Type','application/json');
  res.send(patient_data);
})


app.get('/signup',function(req,res){
  res.sendFile(__dirname+"/signup.html");

});

app.get('/analytics', function(req, res){
  res.sendFile(__dirname+"/analytics.html");
});

app.post("/signup", function(req, res){
  // res.sendFile(__dirname+"/signup.html");
  const userEmail = req.body.email;
  
  // var verificationToken = generateToken();

  // Send the verification email
  // sendVerificationEmail(userEmail, verificationToken);

  // Prompt the user to check their email for the verification link
  // alert(
  //   "A verification link has been sent to your email. Please click the link to complete registration."
  // );rs
});



//Generating token for verification
app.post("/get-token",async function(req,res){
      const data = req.body.value;
      const check = await ID.findOne({id : data});
      if(check){
        TOKEN = generateToken();
      }else{
        patient_data = {
          Doc_ID : -1
        }
      }
});


//function for generating tokens for verifications
function generateToken() {
  // Generate a random token using a library like CryptoJS
  var token = CryptoJS.lib.WordArray.random(4).toString(CryptoJS.enc.Hex);

  // Store the token in the database, associated with the user's email address

  // Return the token
  console.log(token);
  return token;
}


// generateToken();
// Email sending function
// function sendVerificationEmail(email) {
  // Construct the verification URL using the token and your application's base URL
  // var verifyUrl =
  //   "https://abhinav-21.github.io/Healthcare-Record-Management/verify-email?token=" +
  //   token;

  // Construct the email message with the verification URL
  // const emailBody =
  //   "Thank you for registering with our application. Please paste the following token to verify your email address and complete registration: " +
  //   token;

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


cron.schedule(
  "56 22 * * *",
  () => {
    require("./analytics.js");
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

cron.schedule(
  "1 15 * * *",
  () => {
    // require("./gendata.js");
    sendDataToPy();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

// function sendmail(){
// create reusable transporter object using the default SMTP transport
// let transporter = nodemailer.createTransport({
//     host: 'smtp.office365.com',
//     port: 587,
//     secure: false, // secure:false for port 587, secure:true for port 465
//     auth: {
//         user: 'healthcare.record.management@outlook.com',
//         pass: 'hrm@12345'
//     }
// });
// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   auth: {
//     user: "hellen.cummerata31@ethereal.email",
//     pass: "EfmHBKuWvz8ph78Wuu",
//   },
// });

// setup email data with unicode symbols
// let mailOptions = {
//     from: '"Healthcare Record" <healthcare.record.management@outlook.com>',
//     to: 'abhinav.20211055@mnnit.ac.in',
//     subject: 'Test email from Nodemailer',
//     text: 'Hello world from Nodemailer!'
// };

// send mail with defined transport object
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         return console.log("Dhat tere ki");
//     }
//     console.log('Message sent: %s', info.messageId);
// });
// }

// async..await is not allowed in global scope, must use a wrapper
// async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false,
//     auth: {
//       user: "hellen.cummerata31@ethereal.email", // generated ethereal user
//       pass: "EfmHBKuWvz8ph78Wuu", // generated ethereal password
//     },
//   });

  // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <abhitiwari0@outlook.com>', // sender address
//     to: "abhinav.20211055@mnnit.ac.in", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// main().catch(console.error);
