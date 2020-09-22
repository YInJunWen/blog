<!-- Date: 2020-09-21 09:32 -->

# element-ui2 中改变 tree 组件的展示逻辑的两个方案

> "element-ui": "2.13.0",

这个版本中的 tree，默认支持点击箭头收起或展开子节点，领导要求实现以下步骤：

1. 当拥有子节点的节点被初次点击时，只是高亮该节点
2. 点击已经处于高亮状态的节点时，如果该节点处于展开状态，则收起子节点；否则展开子节点

## 方案一

> 思路：利用组件本身的展开和收起事件，手动修改节点状态

1. 每次点击的时候都把当前节点的 ID 名保存到`this.selectedKey`中
2. 当展开事件被触发时，拿被点击节点的`id`旧的`this.selectedKey`做对比,检测该节点是否处于高亮状态，如果已经处于高亮状态，就允许节点展开`node.expanded=true` ；如果未处于高亮状态，就保持该节点的收起状态`expanded=false`;
3. 当收起事件被触发时，同样要检测该节点的高亮状态，如果已高亮，就设置节点收起`expanded=false`；否则保持该节点保持展开状态`expanded=true`

```vue
<template>
    <el-tree ref="orgTree" node-key="id" class="filter-tree" :data="data" :expand-on-click-node="true" :default-expand-all="true" :filter-node-method="treeFilterNode" :highlight-current="true" @node-click="treeClick" @node-expand="nodeExpand" @node-collapse="nodeCollapse" />
</template>
<script>
    export default {
        data() {
            return {
                data: [],
                selectedKey: '',
            };
        },
        methods: {
            nodeExpand(row, node, com) {
                if (row.id == this.selectedKey) {
                    node.expanded = true;
                } else {
                    node.expanded = false;
                }
            },
            nodeCollapse(row, node, com) {
                console.log('nodeCollapse: ', row, node);
                if (row.id == this.selectedKey) {
                    node.expanded = false;
                } else {
                    this.$nextTick(() => {
                        node.expanded = true;
                    });
                }
            },
            treeClick(data, node, com) {
                this.selectedKey = data.id;
            },
        },
    };
</script>
```

这个方案中，要注意的地方：

1. 如果节点处于非高亮状态，需要保持展开或者收缩状态的时候，最好把控制语句放在`this.$nextTick()`中，避免状态改变失败，`this.$nextTick()`的作用可以参考[官方文档](https://cn.vuejs.org/v2/api/#Vue-nextTick)
2. 不要忘记每次点击事件之后，更新`this.selectedKey`的值，它是用来检测被点击节点是否已经处于选中状态的关键因素

## 方案二

> 思路：在点击事件中，判断被点击节点的状态，手动设置子节点的收起或展开状态

1. tree 组件没有可以直接设置节点展开或者收缩的 prop，所以需要在 data 中添加一个`expandedKeys`属性，用来保存已经展开的节点 `ID`
2. 点击节点时，判断该节点是否处于高亮状态
3. 如果未高亮，保持该节点的收缩状态即可，收缩状态可以通过`this.expandedKeys.includes(节点ID)`判断。
4. 如果已高亮，要改变该节点的收缩状态，也是通过`this.expandedKeys.includes(节点ID)`判断。如果处于展开状态，设置子节点收起，并且要在`this.expandedKeys`中去掉将该节点的 ID，；如果处于收起状态，设置子节点展开，还要在`this.expandedKeys`中添加将该节点的 ID；总之目的就是为了保持节点状态和`this.expandedKeys`中的数据保持一致
5. 已高亮状态下改变节点收缩状态时，记得判断一下该节点是否有子节点，如果没有子节点，就不用管他了

```vue
<template><el-tree ref="orgTree" node-key="id" class="filter-tree" :data="data" :expand-on-click-node="true" :filter-node-method="treeFilterNode" :highlight-current="true" @node-click="treeClick"</template>
<script>
    export default {
        data() {
            return {
                data: [],
                selectedKey: '',
                expandedKeys: [],
            };
        },
        methods: {
            treeClick(data, node, com) {
                if (data.id == this.selectedKey) {
                    if (data.children.length > 0) {
                        if (this.expandedKeys.includes(data.id)) {
                            node.expanded = false;
                            this.expandedKeys = this.expandedKeys.filter((item) => {
                                return item != data.id;
                            });
                        } else {
                            node.expanded = true;
                            this.expandedKeys.push(data.id);
                        }
                    }
                } else {
                    if (this.expandedKeys.includes(data.id)) {
                        node.expanded = true; // 保持展开
                    } else {
                        node.expanded = false;
                    }
                }
                this.selectedKey = data.id;
            },
        },
    };
</script>
```

这个方案中要注意的几点：

1. 高亮状态下，**拥有子节点的节点**才需要被修改状态
2. 修改节点状态后，记得更新`this.expandedKeys`数据
3. 如果项目要求默认展开某几个节点，那么除了在元素上设置`default-expanded-keys`属性之外，一定要同时设置`this.expandedKeys`，否则组件的收缩状态和数据不一致可能导致异常。

## 总结

这两种方案都可以实现要求的功能，第二种可能思路要麻烦一些，在`data`中还多了一个属性.具体用哪种方案全凭个人喜好吧。
