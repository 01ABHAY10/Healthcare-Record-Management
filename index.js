const express = require('express');
const  { Web3Storage }  = require('web3.storage');
const  { File }  = require('web3.storage')
const https = require('https');
const { spawn } = require("child_process");

const { KEY } = require ('./config.js');
const { log } = require('console');
const app = express();

const client = new Web3Storage({ token: KEY });

async function upload(){
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
      const info = JSON.stringify(JSON.parse(data));
    })
  })
}

//  upload();
  Retrieve('trial','bafybeicw5nzz3fgqhlhw36a2sin62i6rqiidesegirdo4si44dgy7w53ry');
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(8000, function () {
  console.log("Server started at port 8000.");
});

