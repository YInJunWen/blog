import React, { Component } from 'react';
import { Checkbox, Input, Form, Button } from 'antd';
const FormItem = Form.Item;

class CheckDemo extends Component {
  constructor(props) {
    super(props);
  }
  submit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      console.log('errors: ', errors);
    });
  }
  render() {
    const {
      getFieldProps,
      getFieldValue,
      resetFields,
      getFieldError,
      setFieldsValue,
    } = this.props.form;
    return (
      <Form
        inline={true}
        onSubmit={e => {
          this.submit(e);
        }}
        style={{ padding: '50px' }}
      >
        <FormItem>
          <Checkbox
            {...getFieldProps('dayLeft', {
              onChange: e => {
                // setFieldsValue({ dayLeftInput: '' });
              },
            })}
          >
            每日库存
          </Checkbox>
        </FormItem>
        <FormItem>
          <Input
            disabled={!getFieldValue('dayLeft')}
            {...getFieldProps('dayLeftInput', {
              rules: [
                {
                  validator: (rule, value, cb) => {
                    const errors = [];
                    if (getFieldValue('dayLeft')) {
                      console.log('校验每日库存');
                      if (value === undefined || !value) {
                        errors.push('不能为空');
                        cb(errors);
                      }
                      if (value && isNaN(value)) {
                        errors.push('必须是数字');
                        cb(errors);
                      }
                    }
                    cb(errors);
                    return;
                  },
                },
              ],
            })}
          />
        </FormItem>
        <FormItem>
          <Checkbox
            {...getFieldProps('lifeLeft', {
              onChange: e => {
                // setFieldsValue({ lifeLeftInput: '' });
              },
            })}
          >
            总库存
          </Checkbox>
        </FormItem>
        <FormItem>
          <Input
            disabled={!getFieldValue('lifeLeft')}
            {...getFieldProps('lifeLeftInput', {
              rules: [
                {
                  validator: (rule, value, cb) => {
                    const errors = [];
                    if (getFieldValue('lifeLeft')) {
                      console.log('校验每日库存');
                      if (value === undefined || !value) {
                        errors.push('不能为空');
                        cb(errors);
                      }
                      if (value && isNaN(value)) {
                        errors.push('必须是数字');
                        cb(errors);
                      }
                    }
                    cb(errors);
                    return;
                  },
                },
              ],
            })}
          />
        </FormItem>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form>
    );
  }
}
export default Form.create()(CheckDemo);
