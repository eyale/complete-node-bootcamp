const http = require("http");

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("😊 request", req.url);
  res.end("REQUEST RECEIVED");
});
server.on("request", (req, res) => {
  console.log("😸 another RECEIVED");
});
server.on("close", () => {
  console.log("🌚 server is off");
});

server.listen(3000, "127.0.0.1", () => {
  console.log("🌝 server is on");
});

// _______________________________________
// const EventEmitter = require("events");

// class Sales extends EventEmitter {
//   constructor() {
//     super();
//   }
// }

// const shopEmitter = new Sales();

// shopEmitter.on("startSale", () => {
//   console.log("Sale is STARTED");
// });
// shopEmitter.on("startSale", () => {
//   console.log("New customer is entered");
// });

// shopEmitter.on("startSale", (stock) => {
//   console.log(`There are ${stock} items left in stock`);
// });

// shopEmitter.emit("startSale", 7);
// _______________________________________
