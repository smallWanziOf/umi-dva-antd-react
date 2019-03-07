import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Select, Cascader , Button, Spin } from 'antd';
import styles from './index.less';
import { isMobile } from '../../../services/utils'

const FormItem = Form.Item;
const { Option, OptGroup } = Select;

const SupplierModal = Form.create()(props => {

    const {
        form: { getFieldDecorator },
        modalType,
        data:{editSupplier},
        //options,
        //loadData,
        optionsChange,
        chinaDivision
    } = props;

    // 表单提交
    const handleSearch = e => {
        e.preventDefault();
        const { dispatch, form } = props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            props.onCancel()
            if(modalType == 'add'){
                props.addSupplier(fieldsValue);
            }else{
                props.editSaveSupplier(fieldsValue);
            }
        });
    };

    /*const options = () => {
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
    }*/

    
    //手机号格式验证
    const mobileValidator = (rule, value, call) => {
        if (!value) call();
        if (isMobile(value)) {
            call();
        } else {
            call(new Error());
        }
    }

    return (
        <Form onSubmit={handleSearch} layout="vertical" >
            <h3><b>基础信息</b></h3>
            <div className="ant-divider ant-divider-horizontal mt10"></div>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="公司名称">
                        {console.log('123'+editSupplier)}
                        {getFieldDecorator('companyName',{
                                initialValue:modalType === "add"?'':editSupplier.companyName,
                                rules: [{ required: true, message: '请输入公司名称' }],
                        })(
                            <Input placeholder="请输入公司名称" />
                        )}
                    </FormItem>
                </Col>
                
                {
                modalType != "add" && 
                    <Col md={8} sm={24}>
                        <FormItem label="供应商ID">
                            {getFieldDecorator('supplierId',{
                                    initialValue:editSupplier.supplierId,
                            })(
                                <Input placeholder="请输入供应商ID" disabled/>
                            )}
                        </FormItem>
                    </Col>
                }
                
                <Col md={8} sm={24}>
                    <FormItem label="公司邮箱">
                        {getFieldDecorator('email',{
                                initialValue:modalType === "add"?'':editSupplier.email,
                        })(
                            <Input placeholder="请输入公司邮箱" />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={6} sm={24}>
                    <FormItem label="省">
                        {getFieldDecorator('province',{
                            initialValue:modalType === "add"?'':editSupplier.province
                        })(
                            <Input placeholder="请输入" />
                            // <Cascader 
                            //     options={options()}
                            //     //loadData={loadData}
                            //     onChange={optionsChange}
                            //     //changeOnSelect
                            //     placeholder="请选择公司地址" 
                            // />
                        )}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="市">
                        {getFieldDecorator('city',{
                            initialValue:modalType === "add"?'':editSupplier.city
                        })(
                            <Input placeholder="请输入" />
                            // <Cascader 
                            //     options={options()}
                            //     //loadData={loadData}
                            //     onChange={optionsChange}
                            //     //changeOnSelect
                            //     placeholder="请选择公司地址" 
                            // />
                        )}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="区/县">
                        {getFieldDecorator('district',{
                            initialValue:modalType === "add"?'':editSupplier.district
                        })(
                            <Input placeholder="请输入" />
                            // <Cascader 
                            //     options={options()}
                            //     //loadData={loadData}
                            //     onChange={optionsChange}
                            //     //changeOnSelect
                            //     placeholder="请选择公司地址" 
                            // />
                        )}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="详细地址">
                        {getFieldDecorator('address',{
                                initialValue:modalType === "add"?'':editSupplier.address,
                        })(
                            <Input placeholder="请输入公司详细地址" />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <h3><b>对接人</b></h3>
            <div className="ant-divider ant-divider-horizontal mt10"></div>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="对接人姓名">
                        {getFieldDecorator('buttmanName',{
                                initialValue:modalType === "add"?'':editSupplier.buttmanName,
                                rules: [{ required: true, message: '请输入对接人姓名' }],
                        })(
                            <Input placeholder="请输入对接人姓名" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="联系电话">
                        {getFieldDecorator('buttmanTel',{
                                initialValue:modalType === "add"?'':editSupplier.buttmanTel,
                                rules: [{ 
                                    required: true, message: '请输入联系电话' 
                                },{ 
                                    validator: mobileValidator, message: '手机号码格式不正确' 
                                }],
                        })(
                            <Input placeholder="请输入联系电话" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="对接人邮箱">
                        {getFieldDecorator('buttmanEmail',{
                                initialValue:modalType === "add"?'':editSupplier.buttmanEmail,
                        })(
                            <Input placeholder="请输入对接人邮箱" />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <h3><b>对公账户</b></h3>
            <div className="ant-divider ant-divider-horizontal mt10"></div>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="纳税人识别号">
                        {getFieldDecorator('taxpayerNumber',{
                                initialValue:modalType === "add"?'':editSupplier.taxpayerNumber,
                        })(
                            <Input placeholder="请输入纳税人识别号" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="开户银行">
                        {getFieldDecorator('openBank',{
                                initialValue:modalType === "add"?'':editSupplier.openBank,
                        })(
                            <Input placeholder="请输入开户银行" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="银行账号">
                        {getFieldDecorator('bankAccount',{
                                initialValue:modalType === "add"?'':editSupplier.bankAccount,
                        })(
                            <Input placeholder="请输入银行账号" />
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

export default SupplierModal;