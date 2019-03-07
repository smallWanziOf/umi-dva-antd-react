import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Select, Cascader , Button, Message } from 'antd';
import styles from './index.less';

Message.config({
    top: 200
})

const FormItem = Form.Item;
const { Option, OptGroup } = Select;

const SalesModal = Form.create()(props => {

    const {
        form: { getFieldDecorator },
        modalType,
        data:{ editCustomer },
        //options,
        //loadData,
        chinaDivision,
        optionsChange
    } = props;

    const options = () => {
        let opt = [];
        for(var provice in chinaDivision){
            let temp = {
                value: provice,
                label: provice,
                children: []
            };
            let index = -1;
            for(var city in chinaDivision[provice]){
                temp['children'].push({
                    value:city,
                    label:city,
                    children:[]
                })
                index++;
                chinaDivision[provice][city].map( item => {
                    temp['children'][index]['children'].push({
                        value:item,
                        label:item,
                    })
                })
            }
            opt.push(temp);
        }
        return opt;
    }
    // 表单提交
    const handleSearch = e => {
        e.preventDefault();
        const { form } = props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            if(fieldsValue.customerAddress){
                if(fieldsValue.customerAddress.length<3){
                    Message.error("请填写完整的客户地址")
                    return false
                }
            }
            props.onCancel()
            if(modalType == 'add'){
                props.addCustomer(fieldsValue);
            }else{
                props.editSaveCustomer(fieldsValue);
            }
            
        });
    };

    return (
        <Form onSubmit={handleSearch} layout="vertical" >
            <h3><b>基础信息</b></h3>
            <div className="ant-divider ant-divider-horizontal mt10"></div>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="客户姓名">
                        {getFieldDecorator('customerName',{
                            initialValue:modalType === "add"?'':editCustomer.customerName,
                            rules: [{ required: true, message: '请填写客户姓名' }],
                        })(
                            <Input placeholder="请输入客户姓名"/>
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="联系方式">
                        {getFieldDecorator('tel',{
                            initialValue:modalType === "add"?'':editCustomer.tel,
                            rules: [{ required: true, message: '请输入联系方式' }],
                        })(
                            <Input placeholder="请输入联系方式"/>
                        )}
                    </FormItem>
                </Col>
                {
                    modalType === "add" ?'':
                    <Col md={8} sm={24}>
                        <FormItem label="客户ID">
                            {getFieldDecorator('customerId',{
                                initialValue:modalType === "add"?'':editCustomer.customerId,
                            })(
                                <Input placeholder="请输入客户ID" disabled={true}/>
                            )}
                        </FormItem>
                    </Col>
                }
                <Col md={8} sm={24}>
                    <FormItem label="客户邮箱">
                        {getFieldDecorator('email',{
                                initialValue:modalType === "add"?'':editCustomer.email,
                        })(
                            <Input placeholder="请输入客户邮箱" />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="客户地址">
                        {getFieldDecorator('customerAddress',{
                                initialValue:modalType === "add"?'':[editCustomer.province, editCustomer.city, editCustomer.district],
                            })(
                            <Cascader 
                                options={options()}
                                //loadData={loadData}
                                onChange={optionsChange}
                                //changeOnSelect
                                placeholder="请选择客户地址" 
                            />
                        )}
                    </FormItem>
                </Col>
                <Col md={16} sm={24}>
                    <FormItem label="详细地址">
                        {getFieldDecorator('address',{
                                initialValue:modalType === "add"?'':editCustomer.address,
                        })(
                            <Input placeholder="请输入客户详细地址" />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={24} sm={24} className={"ar"}>
                    <Button type="default" className={'mr10'} onClick={props.onCancel}>取消</Button>
                    <Button type="primary" htmlType="submit" >提交</Button>
                </Col>
            </Row>
        </Form>
    );

})

export default SalesModal;