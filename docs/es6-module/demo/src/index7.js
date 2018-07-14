import { fruits, fruit, update } from "./_constant";

console.log(fruit.name); // "pear"
fruit.name = "orange";
console.log(fruit.name); // "orange"

// fruit = { name: 'juice' }; // SyntaxError: "fruit" is read-only
update();

// SyntaxError: "update" is read-only
// update = function() {
//   console.log("update edited");
// };

console.log(fruits);

fruits[0] = "apple";
console.log(fruits);
