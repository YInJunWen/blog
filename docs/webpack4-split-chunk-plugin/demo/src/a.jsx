import './b.jsx';
function add() {
  import(/* webpackChunkName: "d.dd" */ './d.jsx')
    .then(() => {
      console.log(1);
    })
    .catch(() => {});
}

add();
