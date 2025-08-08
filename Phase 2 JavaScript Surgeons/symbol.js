const id1 = Symbol("userID");
const id2 = Symbol("userID");

console.log(id1 === id2); // false

const user = {
  name: "Amit",
  [id1]: 101
};

console.log(user); // Symbol-keyed property won't show up in console directly
console.log(user[id1]); // 101