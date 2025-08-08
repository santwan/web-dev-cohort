const big = 987654321987654321987654321n;
console.log("BigInt value:", big);

const small = 10;

// This will throw an error:
// console.log(big + small); // ❌ TypeError: Cannot mix BigInt and other types

// Correct way:
console.log(big + BigInt(small)); // ✅ Works fine