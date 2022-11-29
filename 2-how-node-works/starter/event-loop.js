const fs = require("fs");
const crypto = require("crypto");

const startDate = Date.now();

process.env.UV_THREADPOOL_SIZE = 7;

setTimeout(() => console.log("2 - Timer 1 finished"), 0);
setImmediate(() => console.log("5 - Immediate 1 finished"), 0);

fs.readFile("./test-file.txt", "utf8", (err, data) => {
  process.nextTick(() => console.log("4.1 - Process nextTick"));
  console.log("3 - I/O polling task started");

  setTimeout(() => console.log("7 - Timer 2 finished"), 0);
  setTimeout(() => console.log("8 - Timer 3 finished"), 1000);
  setImmediate(() => console.log("6 - Immediate 2 finished"), 0);
  console.log("4 - I/O polling task finished");

  process.nextTick(() => console.log("4.2 - Process nextTick"));

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha256", () => {
    console.log("9 - password encrypted", Date.now() - startDate, "mls");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha256", () => {
    console.log("9 - password encrypted", Date.now() - startDate, "mls");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha256", () => {
    console.log("9 - password encrypted", Date.now() - startDate, "mls");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha256", () => {
    console.log("9 - password encrypted", Date.now() - startDate, "mls");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha256", () => {
    console.log("9 - password encrypted", Date.now() - startDate, "mls");
  });
});

console.log("1 - Hi from the top level code...");
