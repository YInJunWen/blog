# vuex 中 module 的使用

vuex 允许通过 modules 属性定义不同模块的全局模型

```js
const store = new Vue.Store({
    state: {},
    mutations:{},
    actions: {},
    getters:{},
    modules: {
        a: {
            state: {

            },
            getters: {

            }
        }，
        b: {
            state: {

            },
            getters: {

            }
        }
    }
});
```

module 之间也是可以相互嵌套的

```js
const store = new Vue.Store({
    state: {},
    mutations: {},
    actions: {},
    getters: {},
    modules: {
        a: {
            state: {},
            getters: {},
            modules: {
                b: {
                    state: {},
                    getters: {}
                }
            }
        }
    }
});
```

## module 中的 state

在组件内通过正常方式获取 state 要使用`this.$store.state.module名`方法,且要`遵循 module 的嵌套顺序`

```js
const store = new Vue.Store({
    state: {
        count: "global" // 这里的状态是root节点下的
    },
    modules: {
        a: {
            state: {
                count: "a"
            },
            getters: {},
            modules: {
                b: {
                    state: {
                        count: "b"
                    },
                    getters: {}
                }
            }
        }
    }
});

console.log(this.$store.state);

/* 输出：
    {
        count: 'global',
        a: {
            count: 'a',
            b: {
                count: 'b
            }
        }
    }
*/
```

也就是说如果我们需要使用 module-b 中的 count 值，需要使用`this.$store.state.a.b.count`方法才能获取到

## module 中的 getter

获取 getter 的方法则与普通方法一样，使用 this.$store.getters.getter 名`即可

```js
const store = new Vue.Store({
    getters: {
        getterInRoot() {}
    },
    modules: {
        a: {
            state: {},
            getters: {
                getterInA() {
                    return "getterInA";
                }
            },
            modules: {
                b: {
                    state: {},
                    getters: {
                        getterInB() {
                            return "getterInB";
                        }
                    }
                }
            }
        },
        c: {
            state: {},
            getters: {
                getterInC() {
                    return "getterInC";
                }
            }
        }
    }
});

console.log(this.$store.getters);

/* 输出：
    {
        getterInRoot: 'getterInRoot',
        getterInA: 'getterInA',
        getterInB: 'getterInB',
        getterInC: 'getterInC',
    }
*/
```

上面的例子可以看到，获取 getter 的时候不需要遵循嵌套的顺序，这也就导致了`getter 名是不允许重复的`，控制台会输出`duplicate key value`错误.

getter 在 module 中使用的时候，他的属性会增加两个参数，分别是 rootState 和 rootGetter。

```js
const store = new Vue.Store({
    getters: {
        getterInRoot() {
            return "getterInRoot";
        }
    },
    modules: {
        a: {
            state: {
                count: "b"
            },
            getters: {
                getterInA(state, getters, rootState, rootGetter) {
                    return "getterInA";
                }
            },
            modules: {
                b: {
                    namespae: true,
                    state: {
                        count: "b"
                    },
                    getters: {
                        getterInB(state, getters, rootState, rootGetter) {
                            return "getterInB";
                        }
                    }
                }
            }
        },
        c: {
            state: {
                count: "c"
            },
            getters: {
                getterInC() {
                    return "getterInC";
                }
            }
        }
    }
});
```

我们假设 `getterInA` 返回的内容是`{state, getters, rootState, rootGetter}`,现在把 `getterInA` 打印看一下结果

```js
console.log(this.$store.getters.getterInA);

/*
    {
        state: {    记住：state默认是遵循嵌套规则的
            count: 'a',
            b: {
                count: 'b'
            }
        },
        getters:{
            getterInRoot: 'getterInRoot',
            getterInA: 'getterInA',
            getterInB: 'getterInB',
            getterInC: 'getterInC',
        },
        rootGetter: {
            getterInRoot: 'getterInRoot',
            getterInA: 'getterInA',
            getterInB: 'getterInB',
            getterInC: 'getterInC',
        }，
        rootState: {
            a: {
                count: 'a',
                b: {
                    count: 'b
                }
            },
            c: {
                count: 'c'
            }
        }
    }
*/
```

从上面的输出结果可以看出来，module 无论怎么嵌套，他的 getter 和 rootGetter 的内容是一样的，等同于执行了`this.$store.getters`，而 state 中只保存了 module 内部的数据，rootState 则保存了全部的数据，等同于`this.$store.state`的值

## module 中的 mutation

mutation 中定义的函数，只有一个参数 state，且这个 state 无论在哪里，都`只会指向局部的数据`

```js
const store = new Vue.Store({
    modules: {
        a: {
            state: {
                count: "a"
            },
            mutations: {
                incrementA(state) {
                    console.log(state);
                    /*
                        {
                            count: 'a',
                            b: {
                                count: 'b'
                            }
                        }
                    */
                }
            },
            modules: {
                b: {
                    state: {
                        count: "b"
                    },
                    mutations: {
                        incrementB(state) {
                            console.log(state);
                            /*
                                {
                                    count: 'b'
                                }
                            */
                        }
                    }
                }
            }
        }
    }
});
```

mutation 中的方法，也没有遵循嵌套规则，在组件中调用的时候可以继续使用`this.$store.commit()`方法来调用

比如上面例子抛出的 store 中，打印出当前的`this.$store`信息，会发现所有 module 中定义的 mutation 都在同一个层次中

```js
console.log(this.$store);
/*
    {
        _mutations:{
            incrementA: fn,
            incrementB: fn
        }
    }
*/
```

因此我们可以正常通过`this.$store.commit('incremenetA')`和`this.$store.commit('incremenetB')`来提交数据

# module 中的 action

action 中的函数第一个参数正常情况下为上下文 context，当然了我们一般会用 ES6 的解构运算去获取其中的 dispatch，commit，getters 等数据，当使用了 module 后，该上下文会新增两个内容，分别是 rootState，和 rootGetter。这里的 rootState、rootGetter 与 getter 中的指向是一致的，这里就不再举例子了

action 与 mutation 一样，不会遵循嵌套规则，可以通过正常的`this.$store.dispatch()`方法来触发已注册的事件，这里也不再举例

##module 中的命名空间

前面的例子可以看出 action、mutation 中定义的属性都是定义在全局命名空间下的，而 vuex 允许通过在 module 中添加`namespaced: true`来实现局部的命名空间

添加命名空间后，具有局部命名空间的 getter、mutation、action，都必须通过`命名空间/方法名`来访问，没有局部命名空间的则会挂载在上一个命名空间下，如果 module 的嵌套顺序内没有具有独立命名空间的 module，则会挂载在根节点下，也就是说前面不需要再添加命名空间来访问了。以 mutation 为例

```js
const store = new Vue.Store({
    mutations: {
        // 这里的可以直接通过 'mutationInRoot' 访问
        mutationInRoot() {}
    },
    modules: {
        a: {
            namespaced: true,
            state: {
                count: 0
            },
            mutations: {
                mutationInA(state) {} // 自身具有命名空间，访问方式： this.$store.commit('a/mutationInA')
            },
            modules: {
                b: {
                    namespaced: true, // 自身和上一层都具有命名空间，访问方式： this.$store.commit('a/b/mutationInA')
                    mutations: {
                        mutationInB(state) {}
                    }
                },
                c: {
                    mutations: {
                        mutationInC(state) {} // 自身没有具有命名空间，上层具有命名空间，挂载在上层命名空间下，访问方式： this.$store.commit('a/mutationInA')
                    }
                }
            }
        },
        d: {
            mutations: {
                mutationInD() {} // 自身没有命名空间，直接挂载在根节点下，访问方式： this.$store.commit('mutationInD')
            }
        }
    }
});
```

先看一下`this.$store`中显示了那些 mutation

```js
console.log(this.$store);
/*
    {
        _mutations:{
            'mutationInRoot': fn,
            'a/mutationInA': fn,
            'a/b/mutationInB': fn,
            'a/mutationInC': fn,
            'mutationInD': fn,
        }
    }
*/
```

上面的输出中会发现，我们的 mutation 名字前面都加上了命名空间的字符串，因此，如果想在组件中进行提交操作的话我们需要按照下面的方式来操作

```js
this.$store.commit("mutationInRoot");
this.$store.commit("a/mutationInA");
this.$store.commit("a/b/mutationInB");
this.$store.commit("a/mutationInC");
this.$store.commit("mutationInD");
```

getter 在命名空间下的规则和 mutation 一样

```js
const store = new Vue.Store({
    getters: {
        getterInRoot() {} //  直接定义在根节点下  访问方式为： this.$store.getters['getterInRoot'] 或者 this.$store.getters.getterInRoot
    },
    modules: {
        a: {
            namespaced: true,
            getters: {
                getterInA() {}
            },
            modules: {
                c: {
                    namespaced: true,
                    getters: {
                        getterInC() {} //  自身和上一层都有命名空间， 访问方式为： this.$store.getters['a/c/getterInC']
                    }
                },
                d: {
                    getters: {
                        getterInD() {} // 自身没有命名空间，上一层有，访问方式为： this.$store.getters['a/getterInD']
                    }
                }
            }
        },
        b: {
            getters: {
                getterInB() {} // b没有局部命名空间，所以定义在根节点下，访问方式为 this.$store.getters['getterInB'] 或者 this.$store.getters.getterInB
            }
        }
    }
});

console.log(this.$store);
/*
    {
        _getters:{
            'getterInRoot': fn,
            'a/getterInA': fn,
            'getterInB': fn,
            'a/getterInC': fn,
            'a/getterInD': fn
        }
    }
*/
```

所以 action 也是如此

```js
const store = new Vue.Store({
    actions: {
        actionInRoot() {} //  直接定义在根节点下  访问方式为： this.$store.dispatch('actionInRoot') 或者 this.$store.dispatch(actionInRoot
    },
    modules: {
        a: {
            namespaced: true,
            actions: {
                actionInA() {}
            },
            modules: {
                c: {
                    namespaced: true,
                    actions: {
                        actionInC() {} //  自身和上一层都有命名空间， 访问方式为： this.$store.dispatch('a/c/actionInC')
                    }
                },
                d: {
                    actions: {
                        actionInD() {} // 自身没有命名空间，上一层有，访问方式为： this.$store.dispatch('a/actionInD')
                    }
                }
            }
        },
        b: {
            actions: {
                actionInB() {} // b没有局部命名空间，所以定义在根节点下，访问方式为 this.$store.dispatch('actionInB') 或者 this.$store.dispatch('actionInB')
            }
        }
    }
});

console.log(this.$store);
/*
    {
        _actions:{
            'actionInRoot': fn,
            'a/actionInA': fn,
            'actionInB': fn,
            'a/actionInC': fn,
            'a/actionInD': fn
        }
    }
*/
```

# 在局部内访问全局空间

前面的案例中，在具有局部命名空间的 action 内，使用 commit 方法的时候，只会找到局部的 mutation，那么如何在这里访问全局空间呢，可以通过给 commit 传递第三个参数`{root: true}`来实现这个目标

```js
const store = new Vue.Store({
    state: {
        count: 0
    },
    mutations: {
        increment(state) {
            state.count = 1;
        }
    },
    modules: {
        a: {
            namespaced: true,
            state: {
                count: 0
            },
            mutations: {
                increment(state) {
                    state.count = 2;
                }
            },
            actions: {
                actionToSelf({ commit }) {
                    commit("increment");
                },
                actionToRoot({ commit }) {
                    commit("increment", null, { root: true });
                }
            }
        }
    }
});
```

我们在组件内通过定时器同时触发两个 action，看会发生什么

```js
setTimeout(() => {
    this.$store.dispatch("a/actionToSelf"); // 这里还记得为什么前面要加上命名空间吗
    this.$store.dispatch("a/actionToRoot");
}, 2000);

console.log(this.$store.state);
/*
    {
        count: 1,
        a: {
            count: 2
        }
    }
*/
```

结果和我们预料的一样，没有添加`{root: true}`的 action 执行了自己内部的'increment'方法, 而添加了的 action 则执行了根节点下的'increment'方法

那么同样的执行 action 的 dispatch 方法也是这样

```js
const store = new Vue.Store({
    actions: {
        increment() {
            console.log("increment in root");
        }
    },
    modules: {
        a: {
            namespaced: true,
            actions: {
                increment() {
                    console.log("increment in a");
                },
                actionNoRoot({ dispatch }) {
                    dispatch("increment"); // 执行的是内部的 action: increment   输出：increment in a
                },
                actionWithRoot({ dispatch }) {
                    dispatch("increment", null, { root: true }); // 执行的是外部的 action: increment   输出：increment in root
                },
                actionTobNoRoot({ dispatch }) {
                    dispatch("b/increment"); // 直接报错，因为a模块内部没有 'b/increment' 事件
                },
                actionTobWidthRoot({ dispatch }) {
                    dispatch("b/increment", null, { root: true }); // 执行的是外部的的 action: b/increment   输出：increment in b
                }
            }
        },
        b: {
            namespaced: true,
            actions: {
                increment() {
                    console.log("increment in b");
                }
            }
        }
    }
});
```

# 用绑定函数来获取带有命名空间的属性

带有命名空间的属性用绑定函数来操作有点麻烦,以获取 state 中 a 模块的 count 为例，直接操作方法如下：

```js
const store = new Vue.Store({
    modules: {
        a: {
            namespaced: true,
            state: {
                count: 0
            },
            getters: {
                persons: []
            },
            mutations: {
                increment() {}
            },
            actions: {
                update() {}
            },
            modules: {
                b: {
                    namespaced: true,
                    state: {
                        count: 0
                    },
                    getters: {
                        persons: []
                    },
                    mutations: {
                        increment() {}
                    },
                    actions: {
                        update() {}
                    }
                }
            }
        }
    }
});

computed: {
    count: this.$store.state.a.count;
}
```

用绑定函数的获取方法

```js
computed: {
    ...mapState({
        count(state){  // 映射到同名属性
            return state.a.count
        }
    }),
}

computed: {
    ...mapState({
        otherCount(state){ // 映射到不同名属性
            return state.a.count
        }
    })
}
```

如果是嵌套在深层次的怎么办，我们可以把命名空间传递给绑定函数的第一个参数，这样就会默认改变后面映射的上下文，直接拿到想要的数据了, 以拿到 b 模块的 count 为例：

```js
computed: {
    ...mapState('a/b', ['count'])  // 映射到同名属性
}

computed: {
    ...mapState('a/b', {
        count(state){ // 映射到同名属性
            return state.count
        }
    })
}

computed: {
    ...mapState('a/b', {
        otherCount(state){ // 映射到不同名属性
            return state.count
        }
    })
}
```

注意：存在命名空间的时候，`不可以`使用下面的方法了,已经亲测过了,最终的值只会是 `undefined`

```js
...map(['a/b/count'])
...map({
    localCount: 'a/b/count'
})
```

那么同样的 mapGetter 与 mapState 的行为和使用方法是一致的，这里不再举例了
