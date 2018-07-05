import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Form, Input, Button } from 'antd';
const FormItem = Form.Item;
import 'antd/dist/antd.min.css';

class FormDemo extends Component {
  constructor(props) {
    super(props);
  }
  submitHandler(e) {
    e.preventDefault();
    console.log('收到表单值：', this.props.form.getFieldsValue());
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { getFieldProps } = this.props.form;
    return (
      <Form
        onSubmit={this.submitHandler.bind(this)}
        style={{ width: '500px', padding: '10px' }}
      >
        <FormItem label="账户">
          <Input
            placeholder="请输入账户名"
            {...getFieldProps('userName', {
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: '不能为空',
                },
                {
                  pattern: /^\d+$/,
                  message: '必须是数字',
                },
                {
                  validator(rules, value, cb) {
                    cb('不管你填啥我就是想报错');
                  },
                },
              ],
            })}
          />
        </FormItem>
      </Form>
    );
  }
}
const App = Form.create()(FormDemo);
ReactDOM.render(<App />, document.getElementById('root'));
