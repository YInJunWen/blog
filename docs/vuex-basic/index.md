# vuex 初探

> vuex 是一个专门为 vue 应用提供的“全局状态管理库”，所有组件中绑定了 vuex 的部分都可以跟着 vuex 中状态的改变而改变

## 安装方式

```js
npm install vuex --save
```

## 初始化 vuex

```js
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
  },
});

new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>',
});
```

## 修改 state 中的数据: 通过 Mutation

更改`state`中的数据唯一方式就是通过`mutation`，定义的`mutation`接受的第一个参数必须是 `state`本身。

```js
const store = new Vue.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    updateCount(state) {
      state.count--;
    },
  },
});
```

mutation 中定义的方法名实际上是注册一个提交类型，用户可以在组件中通过给`store.commit`方法传递某个提交类型来触发该类型的事件，更新 `state` 的数据

```js
methods: {
    change(){
        this.$store.commit('increment')
    }
    update(){
        this.$store.commit('updateCount')
    }
}
```

如果想在执行更新 state 数据的时候传递参数进去，可以在 mutation 中定义好参数

```js
const store = new Vue.Store({
    state: {
        count: 0
    },
    mutations: {
        increment(state, result){
            state.count = result;  //  count值改变为result
        }
    }
});

methods: {
    change(){
        this.$store.commit('increment', 10)
    }
}
```

上面的案例中，也可以以对象参数的方式修改`state`的属性

```js
const store = new Vue.Store({
    state: {
        count: 0
    },
    mutations: {
        increment(state, result){
            state.count = result.amount;  //  count值改变为result
        }
    }
});

methods: {
    change(){
        this.$store.commit({
            type: 'increment',
            amount: 20
        })
    }
}
```

mutation 也可以通过绑定函数来映射到组件内

```js
methods:{
    ...mapMutations(['increnemtCount'])  // 映射到同名属性，使用方法： this.incrementCount()

    ...mapMutations({
        increment:'incrementCount'  // 映射到不同名属性，使用方法： this.increment()  相当于 this.$store.commit('incrementCount')
    })  
}
```

当然了映射出来的 action 也可以传递参数,以映射到不同名属性为例：

```js
methods:{
    ...mapMutations({
        increment:'incrementCount'  // 映射到不同名属性，使用方法： this.increment()  相当于 this.$store.commit('incrementCount')
    })  
}

this.increment({count: 1})  // 相当于执行了 this.$store.dispathc('incrementCount', {count: 1})
```

## 使用 state 中的数据

`state` 中保存了 SPA 页面加载时最原始的数据，下面是使用 `state` 数据的几种方式

* state 中的属性可以通过`this.$store`方法直接在组件中获取到, 也可以拿来和组件中的数据运算后重新赋值

```js
export default {
  data() {
    return {
      plus: 10,
    };
  },
  computed: {
    count() {
      return this.$store.state.count;
    },
    result() {
      return this.$store.state.count + this.plus;
    },
  },
};
```

* 可以通过给 mapState 传递一个数组参数，把 state 的属性映射到组件的同名属性中

```js
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['count']), //把state.count赋值给 this.count
  },
};
```

* 也可以通过给 mapState 传递一个对象参数，把 state 的属性映射到组件的不同命属性中

```js
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      localCount: state => {
        // 这种方式允许自己定义映射到组件内的属性名
        return state.count;
      },
      localCount: 'count',
    }),
  },
};
```

* 也可以在 store 中直接调用数据:

```js
const store = new Vue.Store({
  state: {
    count: 0,
  },
  getters: {
    getterCount: state => {
      return state.count;
    },
  },
});
```

## 定义一个从 state 扩展出来的属性:getters

当需要返回 `state` 中部分数据的时候，可以通过 `getter` 设置一个属性或方法，可以避免在组件中重复使用查找代码，比如下面的例子中，我们需要通过 `id` 来查找 `persons` 中的某一个元素，如果没有 `getter`，我们就需要在每一个组件中设置一个筛选的方法，这是不可取的。设置 `getter` 后，只需要使用 `getter` 方法就可以。

getter 会默认前面四个参数分别是 state, getters, rootState, rootGetters, 但是 rootState 和 rootGetters 只有的使用 module 的时候才会被暴露出来

```js
const store = new Vue.Store({
  state: {
    persons: [
      {
        name: 'zhangsan',
        id: 1,
      },
      {
        name: 'lisi',
        id: 2,
      },
    ],
  },
  getters: {
    firstPerson: (state, getters) => {
      return state.person.find(item => {
        return item.id == 1;
      });
    },
  },
});
```

下面是使用 getter 的几种方法

* getter 可以在组件中直接通过`this.$store`使用

```html
<template>
    {{firstPerson}}    <!-- {name: 'zhangsan', id: 1} -->
</template>
```

```js
export default {
  computed: {
    firstPerson() {
      // 这里的firstPerson可以设置为随意的字符串
      return this.$store.getters.firstPerson;
    },
  },
};
```

* 使用绑定函数直接把 getter 映射到组件内可以通过数组方式

```js
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['firsrPerson']),
  },
};
```

* 如果你想给 getter 映射一个新的名字，可以通过对象的方式

```js
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      localPerson: 'firstPerson',
    }),
  },
};
```

getter 中也可以定义一个可以传递某个参数的方法， 然后把方法映射到组件中

```js
const store = new Vue.Store({
  state: {
    persons: [
      {
        name: 'zhangsan',
        id: 1,
      },
      {
        name: 'lisi',
        id: 2,
      },
    ],
  },
  getters: {
    getPerson: (state, getters) => id => {
      return state.person.find(item => {
        return item.id == id;
      });
    },
  },
});
```

用法和普通的属性相同，可以通过普通方法和 mapGetter 方法来映射到组件内

## 创建一个 action 来改变 state 的属性值

action 实际上不会直接操作 state，必须通过 mutation 来提交数据。不同的是 action 中可以异步操作，而 mutation 不可以。

```js
const store = new Vue.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    incrementCount({ commit, state }) {
      commit('increment');
    },
  },
});
```

通常情况下，我们会在 action 中返回一个 promise 来告诉组件 commit 事件已经完成

```js
const store = new Vue.Store({
  actions: {
    increnemtCount({ commit }, params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('increment', params);
          resolve();
        }, 2000);
      });
    },
  },
});
```

这样就可以在组件中使用 then 方法来执行下一步操作

```js
methods: {
    update(){
        this.$store.actions.incrementCount().then((res) => {

        }).catch((err) => {

        })
    }
}
```

当然了也可以传递额外的参数进来

```js
methods: {
    update(){
        this.$store.actions.incrementCount(10)
    }
}
```

action 中的方法也可以在 store 中直接调用

```js
const store = new Vue.Store({
  actions: {
    increnemtCount({ commit }, params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('increment', params);
          resolve();
        }, 2000);
      });
    },
    update({ dispatch }) {
      dispatch('incrementCount')
        .then(res => {})
        .catch(err => {});
    },
  },
});
```

注意上面的几个例子中，action 的属性第一个参数必须是 store 的上下文对象，但是我为了方便进行操作，使用了 ES6 的解构赋值操作

action 也可以通过绑定函数来映射到组件内

```js
methods:{
    ...mapActions(['increnemtCount'])  // 映射到同名属性，使用方法： this.incrementCount()

    ...mapActions({
        increment:'incrementCount'  // 映射到不同名属性，使用方法： this.increment()  相当于 this.$store.dispatch('incrementCount')
    })  
}
```

当然了映射出来的 action 也可以传递参数,以映射到不同名属性为例：

```js
methods:{
    ...mapActions({
        increment:'incrementCount'  // 映射到不同名属性，使用方法： this.increment()  相当于 this.$store.dispatch('incrementCount')
    })  
}

this.increment({count: 1})  // 相当于执行了 this.$store.dispathc('incrementCount', {count: 1})
```
