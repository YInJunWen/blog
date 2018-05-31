function deco(target){
    target.prototype.foo = function(){
        console.log('foo')
    }
}

@deco()
class Add{
    add(){
        console.log(1)
    }
}
let a = new Add();
a.foo()

function add(){

}