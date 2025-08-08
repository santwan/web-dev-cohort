const student = {
  name: "Suman",
  age: 22,
  isGraduate: true
};

console.log(student.name);         // Access using dot notation
console.log(student["age"]);       // Access using bracket notation

student.city = "Kolkata";          // Add new property
student["country"] = "India";     // Add using bracket notation

delete student.isGraduate;         // Remove a property
console.log(student);