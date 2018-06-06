let a = '喊';
console.log(a.charCodeAt(0)) // 21898
console.log(a.charCodeAt(1))  // NaN
console.log(a.codePointAt(0))  // NaN

let b = '𠮷';
console.log(b.charCodeAt(0))  // 55362
console.log(b.charCodeAt(1))  // 57271
console.log(b.codePointAt(1))  // 57271