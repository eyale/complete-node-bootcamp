const fs = require('fs');
const http = require('http');
const url = require('url');

const PORT = 8000;

const PATH_NAMES = {
  root: '/',
  overview: '/overview',
  product: '/product',
  api: '/api',
}

const replaceTemplate = (template, item) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, item.productName);
  output = output.replace(/{%ID%}/g, item.id);
  output = output.replace(/{%FROM%}/g, item.from);
  output = output.replace(/{%NUTRIENTS%}/g, item.nutrients);
  output = output.replace(/{%QUANTITY%}/g, item.quantity);
  output = output.replace(/{%PRICE%}/g, item.price);
  output = output.replace(/{%FROM%}/g, item.from);
  output = output.replace(/{%DESCRIPTION%}/g, item.description);
  output = output.replace(/{%IMAGE%}/g, item.image);
  output = output.replace(
    /{%ORGANIC%}/g,
    item.organic ? "Organic" : "not-organic"
  );
  
  if (!item.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  }
  return output;
};

const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template_product.html`,
  "utf-8"
);
const dataJSON = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`,'utf-8');
const parsedJSON = JSON.parse(dataJSON);

const getRespByPathName = (pathName, res) => {
  switch (pathName) {
    case PATH_NAMES.overview:
      res.end(`This is the ${PATH_NAMES.overview} page`);
      return;
    case PATH_NAMES.product:
      res.end(`This is the ${PATH_NAMES.product} page`);
      return;
    case PATH_NAMES.api:
      res.writeHead(200,{
        'Content-Type': 'application/json'
      });
      res.end(dataJSON);
      return;
    case PATH_NAMES.root:
      res.writeHead(200,{
        'Content-Type': 'text/html'
      })
      const cardsHTML = parsedJSON.map(el => replaceTemplate(tempCard, el)).join();

      const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML)
      
      return res.end(output);

    default:
      res.writeHead(404, {
        'Content-Type': 'text/html',
        'my-test-header': 'hello'
      });
      res.end("<h1>Page not found</h1>");
      return;
  }
};
// SERVER 💻💻💻💻💻💻💻💻💻💻💻💻💻💻💻💻💻
const server = http.createServer((req, res) => getRespByPathName(req.url, res));

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
