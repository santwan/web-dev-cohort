let marks = 85;
let percentage = 85.5;
let total = marks + percentage;
console.log("Total marks:", total); // 170.5

let invalid = "hello" - 2; // NaN
console.log("Invalid calculation (string - number):", invalid);

let infiniteValue = 1 / 0; // Infinity
console.log("Division by zero gives:", infiniteValue);

let pi = 3.14159;
console.log("Pi rounded to 2 decimal places:", pi.toFixed(2));

let numString = "42.5"; 
console.log(`numstring variable: ${numString} and type: `+typeof numString);

numString = parseInt(numString); // 42
console.log(`numstring variable: ${numString} and type: `+typeof numString);

numString = "42.5"
numString = parseFloat(numString); // 42.5
console.log(`numstring variable: ${numString} and type: `+typeof numString);