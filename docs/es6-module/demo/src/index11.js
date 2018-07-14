if (true) {
  import('./_constant.js').then(
    ({ default: removeData, insert: insertData, update: updateData }) => {
      removeData(); // "print in export default fn.remove"
      insertData(); // "print in fn.insert"
      updateData(); // "print in fn.update"
    }
  );
}
