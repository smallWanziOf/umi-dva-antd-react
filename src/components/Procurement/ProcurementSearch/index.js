import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Select, Cascader, Button, Slider , DatePicker } from 'antd';
import styles from './index.less';
import moment from 'moment';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const { RangePicker, MonthPicker } = DatePicker;

const ProcurementSearch = Form.create()(props => {

    const {
        form: { getFieldDecorator },
        iduClass
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

    //表单重置
    const handleReset = e => {
        props.form.resetFields();
    }

    const disabledDate = (current) => {
        return current.isBefore(moment(Date.now()).add(-1, 'days'))
    }

    const Option = Select.Option;

    return (
        <Form onSubmit={handleSearch} layout="inline" className={styles.tableListForm}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="预计进货时间">
                        {getFieldDecorator('prePurchaseTiStr')(
                            <DatePicker disabledDate={disabledDate}/>
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
                <Col md={8} sm={24}>
                    <FormItem label="供应商名称">
                        {getFieldDecorator('companyName')(
                            <Input placeholder="请输入供应商名称" />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.procurebtn}>
                <Col md={8} sm={24}>
                    <Button type="primary" htmlType="submit" className={'mr10'}>查询</Button>
                    <Button type="default" onClick={handleReset}>重 置</Button>
                </Col>
            </Row>
        </Form>
    );

})

export default ProcurementSearch;