import React, { PureComponent, Fragment } from 'react';
import {Steps , Table, Button, Message, InputNumber , Select, Spin , Row , Col} from 'antd';
import styles from './index.less';
import router from 'umi/router';

const Step = Steps.Step;

class OrderListDetails extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    
    render() {
        if(!this.props.data.resultInfo){
            return (
                <div className="example">
                    <Spin />
                </div>
            )
        }else{

            const {resultInfo} = this.props.data;
            const renderContent4 = (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                if (index === this.props.data.resultInfo.list.length-1) {
                  obj.props.colSpan = 0;
                }
                return obj;
            };

            const columns = [{
                title: '商品编号',
                dataIndex: 'commodityId',
                key: 'commodityId',
                render: (text, row, index) => {
                    if (index < this.props.data.resultInfo.list.length-1) {
                      return <a href="javascript:;">{text}</a>;
                    }
                    return {
                      children: <b>总计</b>,
                      props: {
                        colSpan: 4,
                      },
                    };
                },
            }, {
                title: '商品名称',
                dataIndex: 'commodityName',
                key: 'commodityName',
                render: renderContent4,
            }, {
                title: '商品条码',
                dataIndex: 'commodityCode',
                key: 'commodityCode',
                render: renderContent4,
            }, {
                title: '单价',
                dataIndex: 'purchasePriceStr',
                key: 'purchasePriceStr',
                render: renderContent4,
            }, {
                title: '数量（件）',
                dataIndex: 'purchaseAmount',
                key: 'purchaseAmount',
                render:(value, row, index) => {
                    if(index == this.props.data.resultInfo.list.length-1){
                        /*let total = 0;
                        this.props.data.resultInfo.list.map( item => {
                            if(item.purchaseAmount){
                                total += parseInt(item.purchaseAmount);
                            }
                        })*/
                        return <b>{this.props.data.resultInfo.commodityCount}</b>;
                    }else{
                        return value
                    }
                }
            }, {
                title: '金额',
                dataIndex: 'totalMoneyStr',
                key: 'totalMoneyStr',
                render:(value, row, index) => {
                    if(index == this.props.data.resultInfo.list.length-1){
                        /*let total = 0;
                        this.props.data.resultInfo.list.map( item => {
                            if(item.totalMoneyStr){
                                total += parseFloat(item.totalMoneyStr);
                            }
                        })*/
                        return <b>{this.props.data.resultInfo.allMoneyStr}</b>;
                    }else{
                        return value
                    }
                }
            }];
            return (
                <div>
                    <Steps progressDot current={3} className={styles.steps}>
                        <Step title="已下单" />
                        <Step title="待付款" />
                        <Step title="待入库" />
                        <Step title="已完成" />
                    </Steps>
                    <div className="ant-divider ant-divider-horizontal"></div>
                    <Row className={'mb10'}>
                        <Col  md={8} sm={24}>
                            <span>订单ID：</span>
                            <span>{resultInfo.orderInfoVO.purchaseOrderNo}</span>
                        </Col>
                        <Col  md={8} sm={24}>
                            <span>供应商：</span>
                            <span>{resultInfo.orderInfoVO.companyName}</span>
                        </Col>
                        <Col  md={8} sm={24}>
                            <span>下单时间：</span>
                            <span>{resultInfo.orderInfoVO.modifyTiStr}</span>
                        </Col>
                    </Row>
    
                    <Row>
                        <Col  md={8} sm={24}>
                            <span>支付方式：</span>
                            <span>{resultInfo.orderInfoVO.paymentMethodStr}</span>
                        </Col>
                        <Col  md={8} sm={24}>
                            <span>支付金额：</span>
                            <span>{resultInfo.orderInfoVO.sumMoneyStr}</span>
                        </Col>
                        <Col  md={8} sm={24}>
                            <span>支付时间：</span>
                            <span>{resultInfo.orderInfoVO.paymentTiStr}</span>
                        </Col>
                    </Row>
    
                    <h3 className={styles.mt50}><b>采购商品</b></h3>
                    <Table rowKey="orderDetails" dataSource={this.props.data.resultInfo.list} columns={columns} pagination={false}/>
                </div>
            );
        }
    }
}

export default OrderListDetails;
