<!-- Date: 2018-01-23 13:10:04 -->

# vue 中创建全局的弹窗组件

> agularJS 中，我使用一个全局的 factory 定义了一个 dict 变量，并在 dict 中创建了一些 alert、confirm 的组件，并且返回一个 promise 对象，方便后续的连续调用，又可以避免每个页面都要引入一次组件。 Vue 中所有的东西都是组件，不能像 angularJS 那样可以定义一个 factory，只能思考其他的方法。

我们以 alert 弹窗为例。

首先弹窗可能存在于任何一个组件中，所以必须有一个可以跨组件通讯的模型，Vue 中有两种方法可以实现：

1.  使用 Vue 的实例事件，

2.  新建另一个 Vue 实例，当做一个插件引入到我们的 Vue 实例中

先说第一种 Vue 的实例事件现在有四种，这几种方法最后都返回的是 Vue 实例，不能返回一个 promise 让我们链式调用，因此这个方法不行

第二种方法：

我们需要自己来创建一个 Vue 的插件，方法如下：
alert/index.vue

```html
<template src="./index.html"></template>
<script>

export default {
  data () {
    return {
      showAlert: false,
      context: '没有标题',
      allowClick: false,
      okText: '确定',
      cancelText: '取消'
    }
  },
  methods: {
    show (context, allowClick, okText, cancelText) {
      let p = new Promise((resolve, reject) => {
        this.showAlert = true

        if (allowClick) {
          this.allowClick = allowClick
        } else {
          setTimeout(() => {
            this.showAlert = false
          resolve({ok: true})
          }, 1000)
          return false
        }
        this.okText = okText || '确定'
        this.cancelText = cancelText || '取消'

        this.btnClick = function (state) {
          this.showAlert = false
          resolve({ok: state})
        }
      })
      return p
    }
  }
}
</script>
<style lang="less"  src="./index.less"></style>
```

`alert/index.html`

```html
<div class="app_alert"  v-show="showAlert">
    <div class="content">
        <p class="context">
            <span>{{context}}</span>
        </p>
        <div class="btnGroup" v-if="allowClick">
            <button  @click="btnClick(true)">{{okText}}</button>
            <button v-show="allowClick"  @click="btnClick(false)">{{cancelText}}</button>
        </div>
    </div>
</div>
```

`alert/index.js`

```js
import Vue from "vue";
import AppAlert from "./index.vue";

// 根据模板创建一个Vue的子类，注意这里是子类，而不是一个实例
const Construct = Vue.extend(AppAlert);

// 生成一个实例，并设置他的模板和组件
const AppAlertComponent = new Construct({
  template: "<AppAlert/>",
  component: AppAlert,
});

// 先挂载组件
const Ele = AppAlertComponent.$mount();

// 把实例插入到body中
document.body.appendChild(Ele.$el);

// Vue规定使用use方法的时候，必须接受一个包含install属性的对象，或者一个function
export default {
  install: Vue => {
    // 把$alert挂在到Vue的属性上
    Vue.prototype.$alert = AppAlertComponent;
  },
};
```

`main.js`

```js
import VAlert from "@/common/app_alert/index.js";
Vue.use(VAlert);
```

现在假设我们有一个组件，我们的调用方法如下：

```js
methods: {
    test () {
        this.$alert.show('确定要删除吗？').then((res) => {
            console.log(res)
        })
    }
}
```
