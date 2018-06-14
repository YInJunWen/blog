console.log([NaN, 2].indexOf(NaN))
console.log([NaN, 2].find(function(item){
  return Object.is(NaN,item)
}))
console.log([NaN, 2].findIndex(function(item){
  return Object.is(NaN,item)
}))