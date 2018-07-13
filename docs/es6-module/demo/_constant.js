export default function remove() {
  console.log('print in export default fn.remove');
}
function insert() {
  console.log('print in fn.insert');
}
const fruit = {
  name: 'pear',
};
function update() {
  console.log('print in fn.update');
}
export { insert, update, fruit };
