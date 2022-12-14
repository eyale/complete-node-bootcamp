/**
 *
 *
 *  [0: exports, 1: require, 2: module, 3: __filename, 4: __dirname];
 */

// class Declaration - means declare class
// class Calculator {
//   add(a, b) {
//     return a + b;
//   }

//   multiply(a, b) {
//     return a * b;
//   }

//   divide(a, b) {
//     return a / b;
//   }
// }

// console.log(arguments);
// class Expression - means that the expression used
module.exports = class {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    return a / b;
  }
};
// console.log(arguments[2]);
