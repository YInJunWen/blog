var tmp = "123";
function add() {
  console.log(tmp);
  if (true) {
    let tmp = "456";
  }
}
add();
console.log(tmp);
