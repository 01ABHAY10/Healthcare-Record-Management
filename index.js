const express = require('express');
const  { Web3Storage }  = require('web3.storage');
const  { File }  = require('web3.storage')
const https = require('https');
const { spawn } = require("child_process");

const { KEY } = require ('./config.js');
const { log } = require('console');
const app = express();

const client = new Web3Storage({ token: KEY });

const server = https.createServer((req, res) => {
  if (req.method === "POST") {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      // Parse JSON data
      const jsonData = JSON.parse(data);

      // Spawn Python script and send JSON data as arguments
      const pythonProcess = spawn("python", [
        "script.py",
        JSON.stringify(jsonData),
      ]);

      // Log output from Python script
      pythonProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      // Handle any errors from the Python script
      pythonProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });

      // Send response to client
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Data received and processed by Python script\n");
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found\n");
  }
});

async function Upload(){
  const obj = { "name": "Healthcare record management", "type": "project","author" : "James Bond" };
  const buffer = Buffer.from(JSON.stringify(obj))

  const files = [ new File([buffer], 'trial.json')];
  const cid = await client.put(files);
  console.log("Stored JSON object with CID : "+ cid);
}

async function Retrieve (id,cid) {
  const url = 'https://ipfs.io/ipfs/'+cid+'/'+id+'.json';
  https.get(url,function(response){
    response.on('data',function(data){
      const obj = JSON.parse(data);
      console.log(obj);
    })
  })
}

//  upload();
  Retrieve('trial','bafybeicw5nzz3fgqhlhw36a2sin62i6rqiidesegirdo4si44dgy7w53ry');
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

server.listen(8000, () => {
  console.log('Server listening on port 8000');
});

