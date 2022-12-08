const fs = require("fs");
const server = require("http").createServer();

const PORT = 8000;
const LOCAL_HOST = "127.0.0.1";

server.on("request", (req, res) => {
  // START 1 solution
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) {
  //     console.log("❌", err);
  //   }
  //   console.log("🚚", data);
  //   res.end(data);
  // });
  // END 1 solution
  // ____________________________________________
  // START 2 solution
  // const readable = fs.createReadStream("test-file.txt");
  // readable.on("data", (chunk) => {
  //   res.write(chunk);
  // });

  // readable.on("end", () => {
  //   res.end();
  // });

  // readable.on("error", (err) => {
  //   console.log("❌", err);
  //   res.statusCode = 500;
  //   res.end("File not found: " + err.message);
  // });
  // END 2 solution
  // ____________________________________________
  // START 3 solution
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
  // source.pipe(destination)
});

server.listen(PORT, LOCAL_HOST, () => {
  console.log("🟢");
});
