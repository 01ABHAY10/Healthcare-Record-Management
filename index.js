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
const { User } = require("./config.js");
const { MAIL_KEY } = require("./config.js");
const bcrypt = require('bcrypt');
const { sendDataToPy } = require("./gendata.js");
const salt = bcrypt.genSaltSync(10);



const app = express();
const client = new Web3Storage({ token: KEY });
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'healthcare.record.management@gmail.com',
    pass: MAIL_KEY,
  },
});




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
  // res.sendFile(__dirname + "/index.html");
  res.sendFile(__dirname+"/signup.html");

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
  Disease_1: disease1 ? disease1 : "-",
  Disease_2: disease2 ? disease2 : "-",
  Disease_3: disease3 ? disease3 : "-",
  Disease_4: disease4 ? disease4 : "-",
  Disease_5: disease5 ? disease5 : "-",
  Disease_6: disease6 ? disease6 : "-",
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
  const id= req.body.id;
  const token = req.body.token;
  try{
    searchMail = await ID.findOne({id : id});
    // console.log(id);
    // console.log(searchMail);
    sendMail(searchMail.email,TOKEN);
  }catch(error){
    console.log(error);
  };
  if(token == TOKEN){
    patient_data = await retrieve(id);
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


// app.post('/signup',function(req,res){
//   const email = req.body.email;
//   const pass = req.body.pass;
//   res.sendFile(__dirname+"/signup.html");

// });
let loggedIn = false;
let Username;
app.post('/homepage',async function(req,res){
  const email = req.body.email1;
  const pass = req.body.password1;
  // console.log(email +" "+ pass);
  try{
    const user = await User.findOne({email : email});
    const passwordMatch = bcrypt.compareSync(pass, user.password);
    if (passwordMatch) {
      res.sendFile(__dirname + "/index.html");
      loggedIn = true;
      Username ={
        name : email
      }
    } else {
      // Passwords do not match, login failed
    }
  }catch(error){
    console.log(error);
  }
});

app.get('/homepage',async function(req,res){
  if(loggedIn){
    res.sendFile(__dirname + "/index.html");
  }else{
    res.status(403).send("Unauthorized access...");
  }
});

//sending token for new account
let  VeriftToken;
app.post('/new-user',async function(req,res){
    const email = req.body.email;
    const pass = req.body.pass;
    const user = await User.findOne({email : email});
    if(user){
      const passwordMatch = bcrypt.compareSync(pass, user.password);
      if (passwordMatch) {
      loggedIn = true;
      Username ={
        name : email
      }
      res.send(true);
    }else{
      res.send(false);
    }
    }
    else{
      VeriftToken = generateToken();
      sendMail(email, VeriftToken);
    }
});

//verifying new account 
app.post('/new-account',async function(req,res){
    const userToken = req.body.value;
    if(userToken == VeriftToken){
      const email = req.body.email;
      const pass = req.body.pass;
      const password = bcrypt.hashSync(pass, salt);
      try{
        const user = await User.create({email,password});
        loggedIn = true;
        Username ={
          name : email
        }
        res.send(true);
      }catch(error){
        console.log(error);
      }
    }else{
      res.send(false);
    }
});

app.get('/analytics', function(req, res){
  if(loggedIn){
  res.sendFile(__dirname+"/analytics.html");
  }else{
    res.status(403).send("Login to see analytics...");
  }
});

//for current user info
app.get('/username', function(req, res){
  res.header('Content-Type','application/json');
  res.send(Username);
});


//for logout
app.get('/logout', function(req, res){
    loggedIn = false;
     Username = null;
     res.send(true);
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
  var token = CryptoJS.lib.WordArray.random(4).toString(CryptoJS.enc.Hex);
  console.log(token);
  return token;
}

function sendMail(To,Token){
  const mailOptions = {
    from: 'Healthcare Record',
    to: To,
    subject: 'Account Verification',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
      .center{
        text-align: center;
        align-items: center;
        align-self: center;
        align-content: center;
      }
      </style>
    </head>
    <body>
        <h1 class="center">Token Verification - Action Required</h1>
        <p>
        Please note that the <b>Token</b> is valid for a limited time and should be used immediately to ensure successful verification. 
        In case you do not complete the verification within the specified time, you may need to request a new <b>Token</b>.
        </p>
        <h2 class="center">${Token}</h2>
        <p>
        If you have any questions or encounter any difficulties during the process, please do
         not hesitate to reach out to our customer support team at healthcare.record.management@gmail.com.
          We are available 24x7 and will be glad to assist you.
        </p>
        <h3 style="color: blue;">- Team @healthcare_record<h3>
    </body>
    </html>
    
    `,
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
  
}

cron.schedule(
  "36 9 * * *",
  () => {
    require("./analytics.js");
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

cron.schedule(
  "0 0 * * *",
  () => {
    require("./gendata.js");
    sendDataToPy();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
