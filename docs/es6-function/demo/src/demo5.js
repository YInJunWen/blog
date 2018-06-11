function add() {
  let foo = () => {
    console.log(this.id);
  };
}
function foo(){
    setTimeout(()=>{
        console.log(this.name)
    })
}