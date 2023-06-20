
const https = require("https");
const { spawn } = require("child_process");
const { ID } = require("./config.js");
const { Var } = require("./config.js");


async function retrieve(id) {
  try {
    const key = await ID.findOne({ id: id });
    const cid = key.cid;
    const url = "https://ipfs.io/ipfs/" + cid + "/" + id + ".json";
    const data = await new Promise(function (resolve, reject) {
      https.get(url, function (response) {
        response.on("data", function (data) {
          const obj = JSON.parse(data);
          resolve(obj);
        });
      });
    });
    return data;
  } catch (error) {
    console.log("Invalid id");
    return -1;
  }
}


async function getFilename() {
  try {
    const latest = await ID.findOne().sort({ id: -1 }).exec();
    const fileNo = latest.id + 1;
    return fileNo;
  } catch (error) {
    return -1;
  }
}

async function sendDataToPy() {
  const last = await Var.findOne({name:"last"});
  let n = await getFilename();
  for (let i = last.value; i < n; i++) {
    const obj = await retrieve(i);
    const python = spawn("python", ["filegenerator.py"]);
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
  }
  last.value = n;
  await last.save();
}

module.exports = {sendDataToPy};
