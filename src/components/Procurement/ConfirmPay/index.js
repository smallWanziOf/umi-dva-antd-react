import React, { PureComponent, Fragment } from 'react';
import {Steps , Table, Button, Select, DatePicker , Input, Spin , Row , Col , Message} from 'antd';
import styles from './index.less';
import router from 'umi/router';
import { OrderStatusList } from '../../../services/setting';
import moment from 'moment';

Message.config({
    top: 200,
  });

const Step = Steps.Step;

const Option = Select.Option;

class ConfirmPay extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            paymentTiStr:null,
            paymentAccount:'',
            receiver:'',
            paymentMethod:'',
            rderStatusOtion:[]
        }
    }

    componentDidMount = () => {
        fetch(`${OrderStatusList}/JSBSCMPaymentMethod`).then(function (response) {
            return response.json();
        }).then((data) => {
            let { resultInfo } = data;
            let temp = [];
            resultInfo.map(item => {
                temp.push({
                    value:item.codeKey,
                    lable:item.codeValue
                })
            })
            this.setState({
                rderStatusOtion:temp
            })
        }).catch(function (e) {
            // console.log("Oops, error");
        });
    }

    // 选择日期改变
    dateChange = (value,ss) => {
        this.setState({
            paymentTiStr:ss  
        })
    }

    // 支付账户改变
    accountChange = (e) => {
        const { value } = e.target
        this.setState({
            paymentAccount:value
        })
    }

    // 收款人改变
    nameChange = (e) => {
        const { value } = e.target
        this.setState({
            receiver:value
        })
    }

    // 付款方式
    payWayChange = (value) => {
        this.setState({
            paymentMethod:value
        })
    }

    // 点击取消
    clickCancel = () => {
        router.push('/procurement/orderList')
    }

    // 点击提交
    handleSubmit = () => {
        let {paymentTiStr,paymentAccount,receiver,paymentMethod} = this.state;
        if(!paymentTiStr || !paymentAccount || !receiver || !paymentMethod){
            Message.warning('请完善信息后提交');
            return false;
        }
        this.props.handleSubmit(paymentTiStr,paymentAccount,receiver,paymentMethod)
    }

    // 禁止选择的日期
    disabledDate = (current) => {
        return current.isBefore(moment(Date.now()).add(-1, 'days'))
    }
    
    render() {
        
        if(!this.props.data.resultInfo){
            return (
                <div className="example">
                    <Spin />
                </div>
            )
        }else{
            
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
                    <Steps progressDot current={1} className={styles.steps}>
                        <Step title="已下单" />
                        <Step title="待付款" />
                        <Step title="待入库" />
                        <Step title="已完成" />
                    </Steps>
                    <div className="ant-divider ant-divider-horizontal"></div>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }} >
                        <Col md={8} sm={24}>
                            选择日期：<DatePicker onChange={this.dateChange}  disabledDate={this.disabledDate}/>
                        </Col>
                        <Col md={8} sm={24}>
                            支付账户：<Input
                                onChange={e=>this.accountChange(e)}
                                placeholder="请输入支付账户"
                                maxLength={20}
                                className={styles.inputUnset}
                            />
                        </Col>
                    </Row>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={"mt15"}>
                        <Col md={8} sm={24}>
                            <span className={styles.receivePeople}>收款人</span>：
                            <Input
                                onChange={e=>this.nameChange(e)}
                                placeholder="请输入收款人姓名"
                                className={styles.inputUnset}
                            />
                        </Col>
                        <Col md={8} sm={24}>
                            付款方式：<Select
                                style={{ width: 174 }}
                                placeholder="请输入付款方式"
                                onChange={this.payWayChange}
                            >
                                {this.state.rderStatusOtion.length>0 ? (this.state.rderStatusOtion.map((d) => <Option value={d.value} key={d.value}>{d.lable}</Option>)) : null}
                            </Select>
                        </Col>
                    </Row>
                    <div className="ant-divider ant-divider-horizontal"></div>
                    <h3 className={styles.mt50}><b>采购商品</b></h3>
                    <Table dataSource={this.props.data.resultInfo.list} columns={columns} pagination={false}/>

                    <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.mt50}>
                        <Col md={24} sm={24} className={styles.tr}>
                            <Button className={'mr10'} onClick={this.clickCancel}>取消</Button>
                            <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                        </Col>          
                    </Row>
                </div>
            );
        }
    }
}

export default ConfirmPay;
