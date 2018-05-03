# antd 中的多个 treeSelect 联动效果

需求如下：

* 页面中有三个 treeSelect 组件，里面的数据是同一个数据，
* 当其中一个 treeSelect 中的节点被选中的时候，其他 treeSelect 中对应节点不能被选中，
* 如果某个 treeSelect 中子节点都被禁用，自动把子节点的父节点设为禁用状态

实现方式如下(后面有要点):

```js
import React, { Component } from 'react';
import { TreeSelect } from 'antd';

const SHOW_CHILD = TreeSelect.SHOW_CHILD;

require('antd/dist/antd.css');

let treeData = [
  {
    label: '节点一',
    value: '0-0',
    key: '0-0',
    children: [
      {
        label: '子节点一',
        value: '0-0-0',
        key: '0-0-0',
      },
      {
        label: '子节点2',
        value: '0-0-1',
        key: '0-0-1',
      },
    ],
  },
  {
    label: '节点二',
    value: '0-1',
    key: '0-1',
    children: [
      {
        label: '子节点三',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        label: '子节点四',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        label: '子节点五',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
];

function filterChildValues(firstLEvelValue) {
  let values = [];
  for (let i = 0; i < treeData.length; i++) {
    const item = treeData[i];
    if (item.value === firstLEvelValue) {
      item.children.forEach(item => {
        values.push(item.value);
      });
    }
  }
  return values;
}
const testData = [{ name: 'zhangsan' }];
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData1: JSON.parse(JSON.stringify(treeData)),
      treeData2: JSON.parse(JSON.stringify(treeData)),
      treeData3: JSON.parse(JSON.stringify(treeData)),
      value1: [],
      value2: [],
      value3: [],
      test1: [].concat(testData),
      test2: [].concat(testData),
      test3: [].concat(testData),
    };
  }
  componentDidMount() {
    testData[0].name = 'lisi';
    console.log(testData);
    console.log(this.state.test1);
    console.log(this.state.test2);
    console.log(this.state.test3);

    return false;
    treeData[0].children[0].disabled = true;
    // console.log(newTree[0].children[0]);
    console.log(this.state.treeData1[0].children[0]);
    console.log(this.state.treeData2[0].children[0]);
    console.log(this.state.treeData3[0].children[0]);
  }

  onChange(index, value, node, extra) {
    return false;
  }
  changeOtherTreedata(index, value, state) {
    for (let i = 1; i <= 3; i++) {
      if (index !== i) {
        const newTree = [].concat(this.state['treeData' + i]);
        newTree.forEach(item1 => {
          if (item1.value === value) {
            item1.disabled = state;
            item1.children.forEach(item2 => {
              item2.disabled = state;
            });
          }
        });
        this.setState(state => {
          return {
            ['treeData' + i]: newTree,
          };
        });
      }
    }
  }
  onSelect(index, value, node, event) {
    console.log('current index is ' + index);
    const checked = event.checked;
    const oldValues = [].concat(this.state['value' + index]);
    if (value.length === 3) {
      // 处理点击第一级菜单事件
      // 获取第一级菜单下所有子菜单的value，并添加到treeValue
      const childValues = filterChildValues(value);
      console.log(childValues);
      if (checked) {
        // 处理选中事件
        const newValues = oldValues.concat(childValues);
        this.setState(state => {
          return {
            ['value' + index]: newValues,
          };
        });

        // 处理其他数据源中的disable状态
        this.changeOtherTreedata(index, value, true);
      } else {
        // 处理取消选中事件
        let newValues = [];
        oldValues.forEach(item => {
          if (!item.indexOf(childValues)) {
            newValues.push(item);
          }
        });
        console.log(newValues);
        this.setState(state => {
          return {
            ['value' + index]: newValues,
          };
        });
        // 处理其他数据源中的disable状态
        this.changeOtherTreedata(index, value, false);
      }
    } else {
      // 处理点击第二级菜单事件
      if (checked) {
        // 处理选中事件
        const newValues = [...oldValues, value];
        console.log(index + '表格，更新后的value值是：' + newValues);
        this.setState(state => {
          return {
            ['value' + index]: newValues,
          };
        });
        // 处理其他数据源状态
        let data = {};
        for (let i = 1; i <= 3; i++) {
          if (index !== i) {
            data['treeData' + i] = this.changeOtherTreedataSecond(i, value);
          }
        }
        // console.log({ ...this.state, ...data });
        this.setState(state => {
          return { ...state, ...data };
        });
      } else {
        // 处理取消选中事件
        let newValues = [];
        oldValues.forEach(item => {
          if (item !== value) {
            newValues.push(item);
          }
        });
        this.setState(state => {
          return {
            ['value' + index]: newValues,
          };
        });
        // 处理其他数据源状态
        for (let i = 1; i <= 3; i++) {
          if (index !== i) {
            let newTree = [...this.state['treeData' + i]];
            newTree.forEach(item1 => {
              item1.disabled = false;
              item1.children.forEach(item2 => {
                if (item2.value === value) {
                  item2.disabled = false;
                }
              });
            });
            this.setState(state => {
              return {
                ['treeData' + i]: newTree,
              };
            });
          }
        }
      }
    }
  }
  changeOtherTreedataSecond(index, value) {
    console.log(index, value);
    let newTree = [...this.state['treeData' + index]];
    newTree.forEach(item1 => {
      let flag = true;
      item1.children.forEach(item2 => {
        if (
          item2.value === value &&
          this.state['value' + index].indexOf(value) < 0
        ) {
          item2.disabled = true;
        }
        if (!item2.disabled) {
          flag = false;
        }
      });
      if (flag) {
        item1.disabled = true;
      }
    });
    return newTree;
  }
  render() {
    return (
      <div>
        <TreeSelect
          treeData={this.state.treeData1}
          value={this.state.value1}
          onChange={(value, node, extra) => {
            this.onChange(1, value, node, extra);
          }}
          onSelect={(value, node, extra) => {
            this.onSelect(1, value, node, extra);
          }}
          multiple={true}
          treeCheckable={true}
          showCheckedStrategy={SHOW_CHILD}
          searchPlaceholder={'请选择'}
          style={{
            width: 300,
          }}
        />
        <br />
        <TreeSelect
          treeData={this.state.treeData2}
          value={this.state.value2}
          onChange={(value, node, extra) => {
            this.onChange(2, value, node, extra);
          }}
          onSelect={(value, node, extra) => {
            this.onSelect(2, value, node, extra);
          }}
          multiple={true}
          treeCheckable={true}
          showCheckedStrategy={SHOW_CHILD}
          searchPlaceholder={'请选择'}
          style={{
            width: 300,
          }}
        />
        <br />
        <TreeSelect
          treeData={this.state.treeData3}
          value={this.state.value3}
          onChange={(value, node, extra) => {
            this.onChange(3, value, node, extra);
          }}
          onSelect={(value, node, extra) => {
            this.onSelect(3, value, node, extra);
          }}
          multiple={true}
          treeCheckable={true}
          showCheckedStrategy={SHOW_CHILD}
          searchPlaceholder={'请选择'}
          style={{
            width: 300,
          }}
        />
      </div>
    );
  }
}
```

这个 DEMO 中有一个**超级超级超级**重要的要点，那就是关于**数组的深拷贝问题**：

> 当数组内包含对象的时候，如果想得到一个数组的副本，且数组中的元素不是引用源数组中元素的内存地址，需要特殊处理，具体请看[如何对数组进行拷贝](./js-copy-array-deep.md)
