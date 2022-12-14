// console.log(arguments); // [0: exports, 1: require, 2: module, 3: __filename, 4: __dirname];
// console.log(require("module").wrapper);

// module.exports___________________________________________
const Calculator = require("./test-module-1");
const CalcInstance = new Calculator();
console.log(CalcInstance.add(2, 7));

// exports__________________________________________________
// const calc2 = require("./test-module-2");
const { add, multiply, divide } = require("./test-module-2");
console.log(add(2.2, 6));

// caching__________________________________________________
require("./test-module.3")();
require("./test-module.3")();
require("./test-module.3")();
