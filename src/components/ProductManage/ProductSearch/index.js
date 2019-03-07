import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Select, Cascader, Button, Slider } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;

const ProductSearch = Form.create()(props => {

    const capitallistx = ['0万', '100万', '200万', '500万', '1000万', '以上']
    const capitallistxp = capitallistx.slice(0, 5)
    const capitallistd = {}

    for (let i = 0; i < capitallistx.length - 1; i++) {
        const capitalKey = capitallistx[i];
        capitallistd[capitalKey] = []
        for (let j = i; j < capitallistx.length - 1; j++) {
            capitallistd[capitalKey].push(capitallistx[j + 1])
        }
    }

    const {
        form: { getFieldDecorator },
        handleResetState
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
                    <FormItem label="商品名称">
                        {getFieldDecorator('commodityName')(
                            <Input placeholder="请输入商品名称" />
                        )}
                    </FormItem>
                </Col>
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

export default ProductSearch;