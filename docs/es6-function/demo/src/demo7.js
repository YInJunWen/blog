var height = 30;
let width = 60;
let hoo = () => {
    console.log(this)
}
module.exports ={
    name: 'zhangsan',
    add: function(){
        console.log(this.name)
    },
    // foo(){
    //     console.log(this)
    // },
    // hoo: () => {
    //     console.log(this)
    // }
}