var names = 'lisi';
class Egg {
  static get names() {
    return 'zhangsan';
  }
  static get [Symbol.unscopables]() {
    return {
      names: true,
    };
  }
}
with (Egg) {
  console.log(names);
}
