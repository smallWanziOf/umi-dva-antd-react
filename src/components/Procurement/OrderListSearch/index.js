import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Select, Cascader, Button, Slider } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;

const OrderListSearch = Form.create()(props => {

    const {
        form: { getFieldDecorator },
        rderStatusOtion,
        handleResetState,
    } = props;

    // 表单提交
    const handleSearch = e => {
        e.preventDefault();
        const { dispatch, form } = props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            props.querylist(fieldsValue);
        });
    };

    const handleReset = () => {
        props.form.resetFields();
        handleResetState();
    }

    const Option = Select.Option;

    return (
        <Form onSubmit={handleSearch} layout="inline" className={styles.tableListForm}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="订单号">
                        {getFieldDecorator('purchaseOrderNo')(
                            <Input placeholder="请输入订单号" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="订单状态">
                        {getFieldDecorator('orderStatus')(
                            <Select
                                style={{ width: '100%' }}
                                placeholder="请选择"
                            >{rderStatusOtion.length ? (rderStatusOtion.map((d) => <Option value={d.value} key={d.value}>{d.lable}</Option>)) : ''}</Select>
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="商品名称">
                        {getFieldDecorator('commodityName')(
                            <Input placeholder="请输入商品名称" />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="供应商名称">
                        {getFieldDecorator('companyName')(
                            <Input placeholder="请输入供应商名称" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <Button type="primary" htmlType="submit" className={'mr10'}>查询</Button>
                    <Button type="default" onClick={handleReset}>重 置</Button>
                </Col>
            </Row>
        </Form>
    );

})

export default OrderListSearch;