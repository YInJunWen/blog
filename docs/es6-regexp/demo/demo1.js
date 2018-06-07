function codePointLength(text) {
  var result = text.match(/[\s\S]/gu);
  console.log(result)
  return result ? result.length : 0;
}

var s = '𠮷𠮷a';

console.log(s.length) // 4
console.log(codePointLength(s)); // 2
