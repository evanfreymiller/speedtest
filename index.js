const express = require("express");
const app = express();
const port = 9700;

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

const TOKEN = "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm";

const FastSpeedtest = require("fast-speedtest-api");

const server = require("http").Server(app);
const io = require("socket.io")(server);

let speedtest = new FastSpeedtest({
  token: TOKEN, // required
  verbose: false, // default: false
  timeout: 10000, // default: 5000
  https: true, // default: true
  urlCount: 5, // default: 5
  bufferSize: 8, // default: 8
  unit: FastSpeedtest.UNITS.Mbps, // default: Bps
});

db.defaults({
  tests: [],
  running: false,
}).write();

app.get("/api/speed/history", (req, res) => {
  const history = db.get("tests").value();
  console.log(history);
  res.send(history);
});

app.get("/api/speed/test", (req, res) => {
  speedtest
    .getSpeed()
    .then((s) => {
      db.get("tests").push({ x: new Date(), y: s.toFixed(0) }).write();
      res.send({ x: new Date(), y: s.toFixed(0) });
    })
    .catch((e) => {
      console.error(e.message);
    });
});

app.get("/api/speed/start", (req, res) => {
  db.set("running", true).write();
  speedtest
    .getSpeed()
    .then((s) => {
      console.log({ x: new Date(), y: s.toFixed(0) });
      db.get("tests").push({ x: new Date(), y: s.toFixed(0) }).write();
      res.send({ x: new Date(), y: s.toFixed(0) });
      run();
    })
    .catch((e) => {
      console.error(e.message);
      res.send({ error: "Unknown error, attempting test again." }).status(503);
      run();
    });
});

app.get("/api/speed/stop", (req, res) => {
  db.set("running", false).write();
  res.send({ status: { running: false } });
});

app.get("/api/speed/status", (req, res) => {
  res.send(db.get("running").value());
});

const run = () => {
  if (db.get("running").value()) {
    setTimeout(() => {
      speedtest
        .getSpeed()
        .then((s) => {
          console.log({ x: new Date(), y: s.toFixed(0) });
          db.get("tests").push({ x: new Date(), y: s.toFixed(0) }).write();
          io.emit('speeds_update', db.get('tests').value())
          run();
        })
        .catch((e) => {
          console.error(e);
          run();
        });
    }, 60000);
  } else {
    console.log("Testing closed.");
  }
};

server.listen(port, () => {
  db.set('running', false).write();
  console.log(`Express app listening at http://localhost:${port}`)
})
