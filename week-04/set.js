const selectedCourses = new Set();
selectedCourses.add("Math");
selectedCourses.add("Physics");
selectedCourses.add("Math"); // Duplicate, won't be added again

console.log(selectedCourses.has("Math")); // true
console.log(selectedCourses); // Set(2) { 'Math', 'Physics' }

selectedCourses.delete("Physics");
console.log(selectedCourses); // Set(1) { 'Math' }