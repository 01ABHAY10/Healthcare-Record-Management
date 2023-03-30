const express = require("express");
const bodyParser = require("body-parser");
const  Web3Storage  = require('web3.storage');



const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEQ5OTQ2YkM3ZDExNzU1ZTUxRWEyQUU4OEU3RjA1YjAwYkIyN2JlNzkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODAxNzIyNDU5NDcsIm5hbWUiOiJIQ1JNIn0.gDA83LOadNzAUVYV9s7H_gfFkDJBRYT85cR6cbmM49Y";
const client = new Web3Storage({ token: KEY });

const file = new File(['Healthcare Record management !'], 'project.txt', { type: 'text/plain' });
async function upload(){
  const cid = await client.put(file);
  console.log('File stored with CID:', cid);
}
upload();

const app = express();

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, function () {
  console.log("Server started at port 3000.");
});

