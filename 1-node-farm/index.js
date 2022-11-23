const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require("./modules/replaceTemplate");

const PORT = 8000;

const PATH_NAMES = {
  root: '/',
  overview: '/overview',
  product: '/product',
  api: '/api',
}

const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template_product.html`,
  "utf-8"
);
const dataJSON = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`,'utf-8');
const parsedJSON = JSON.parse(dataJSON);

const getRespByPathName = (pathName, query, res) => {
  switch (pathName) {
    case PATH_NAMES.product:
      const product = parsedJSON[query.id];
      const outputTemplate = replaceTemplate(tempProduct, product);

      res.writeHead(200, { "Content-Type": "text/html" });

      res.end(outputTemplate);
      return;
    case PATH_NAMES.api:
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(dataJSON);
      return;
    case PATH_NAMES.root:
    case PATH_NAMES.overview:
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      const cardsHTML = parsedJSON
        .map((el) => replaceTemplate(tempCard, el))
        .join();

      const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);

      return res.end(output);

    default:
      res.writeHead(404, {
        "Content-Type": "text/html",
        "my-test-header": "hello",
      });
      res.end("<h1>Page not found</h1>");
      return;
  }
};
// SERVER 💻💻💻💻💻💻💻💻💻💻💻💻💻💻💻💻💻
const server = http.createServer((req, res) => {
  const {query, pathname} = url.parse(req.url, true);
  
  getRespByPathName(pathname, query, res);
});

server.listen(PORT, () => {
  console.log(`SERVER runs on port ${PORT}\n`);
});


// FILES 🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️
// // NON-BLOCKING CODE, ASYNCHRONOUS
// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data) => {
//   if(!err) {
//     fs.readFile(`./starter/txt/${data}.txt`, "utf-8", (err, data2) => {
//       if (!err) {
//         console.log("2 👍🏻❗ > data", data2);
//         fs.readFile(`./starter/txt/append.txt`, "utf-8", (err, data3) => {
//           if (!err) {
//             console.log("3 👍🏻❗ > data", data3);
//             fs.writeFile(`./starter/txt/final.txt`, `DATA 2: ${data2}\n\nDATA 3: ${data3}`, "utf-8", (err) => {
//               if (err) {
//                 console.log('❗🥵 👎🏻 > err', err); 
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// });
// console.log('1 👍🏻');

// // BLOCKING CODE, SYNCHRONOUS
// const textIn = fs.readFileSync('./starter/txt/read-this.txt', 'utf-8');
// console.log(textIn);

// const textOut = `OUTPUT: ${textIn}.\nCreated at ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOut);
