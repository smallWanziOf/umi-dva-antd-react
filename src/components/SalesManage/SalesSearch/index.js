import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Select, Cascader, Button, Slider } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;

const SalesSearch = Form.create()(props => {

    const {
        form: { getFieldDecorator },
        handleResetState
    } = props;

    // 订单查询的三种状态
    const handleReset = () => {
        props.form.resetFields();
        handleResetState()
    }

    // 表单提交
    const handleSearch = e => {
        e.preventDefault();
        const { dispatch, form } = props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            props.querylist(fieldsValue);
        });
    };

    return (
        <Form onSubmit={handleSearch} layout="inline" className={styles.tableListForm}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="客户姓名">
                        {getFieldDecorator('customerName')(
                            <Input placeholder="请输入客户姓名" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="客户ID">
                        {getFieldDecorator('customerId')(
                            <Input placeholder="请输入客户ID" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <Button type="primary" htmlType="submit" className={'mr10'}>查询</Button>
                    <Button type="default" onClick = {handleReset}>重 置</Button>
                </Col>
            </Row>
        </Form>
    );

})

export default SalesSearch;