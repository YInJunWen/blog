if (true) {
  import('./_constant.js').then(({ insert, update }) => {
    insert(); // "print in fn.insert"
    update(); // "print in fn.update"
  });
}
