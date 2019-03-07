import React, { PureComponent, Fragment } from 'react';
import Link from 'umi/link';
import { Upload, Table, Alert, Button, Modal , Steps , Message, Icon } from 'antd';
import { uploadAction } from '@/services/setting';
import styles from './index.less';
import router from 'umi/router';

Message.config({
    top: 200
})

const Step = Steps.Step;

const Dragger = Upload.Dragger;

class OrderListTable extends PureComponent {
    constructor(props) {
        super(props);
        const { data } = props;
        // const needTotalList = initTotalList(columns);
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            changingId: '',
            selectCount:0,
            amount:0,
            visible: false,
            selectedRows:[]
        };
    }

    //点击清空
    handleClear = () => {
        this.setState({
            selectedRowKeys:[],
            selectCount:0,
            selectedRows:[],
            amount:0,
        })
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
        // console.log(this.state.data)
    }

    cleanSelectedKeys = () => {
        this.setState({ selectedRowKeys: [] });
    }


    defaultChecked = (start) => {
        if (start === 1001) {
            return true
        } else if (start === 1002) {
            return false
        }
    }

    handleTableChange = (pagination) => {
        this.handleClear();
        const { onChange } = this.props;
        if (onChange) {
            onChange(pagination);
        }
    };

    //table提示信息
    tableAlert = ()=> <div>已选择<b><a>{this.state.selectCount}</a></b>项 总金额：<b>{this.state.amount}</b> <a onClick={this.handleClear}>清空</a></div>

    showModal = () => {
        this.setState({
          visible: true,
        });
    }

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    
    // 点击去付款
    handlePay = (e,record) => {
        e.preventDefault();
        this.props.handlePay(record);
    }
    
    // 点击去入库
    handleWareHose = (e,record) => {
        e.preventDefault();
        this.props.handleWareHose(record);
    }

    // 点击导出采购订单
    procuremeExpertExcel = () => {
        this.props.procuremeExpertExcel(this.state.selectedRows)
    }

    // 点击批量删除
    batchDelete = () => {
        this.props.batchDelete(this.state.selectedRows);
        this.handleClear();
    }

    render() {
        const { selectedRowKeys, changingId } = this.state;
        // const rowSelection = {
        //     selectedRowKeys,
        //     onChange: this.onSelectChange,
        // };
        const { data:{getProcureOrderList:{list=[],total}} , loading} = this.props;

        if(Object.keys(list).length){
            if(Object.keys(list.resultInfo).length == 0){
                list.resultInfo = []
            }
        }
        

        //上传参数
        const uploadProps = {
            name: 'file',
            action: uploadAction,
            // headers: {
            //     authorization: 'authorization-text',
            // },
            onChange(info) {
                // console.log(info.file)
                if (info.file.status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    if(info.file.response && !info.file.response.result){
                        Message.error(`${file.name} - ${info.file.response.msg}`);
                    }else{
                        Message.success(`${info.file.name} file uploaded successfully.`);
                    }
                } else if (info.file.status === 'error') {
                    Message.error(`${info.file.name} 上传失败`);
                }
            }
        };

        const paginationProps = {
            current:this.props.current,
            showTotal: () => `共 ${total.recordCount} 条记录 第 ${this.props.current} / ${total.totalPage} 页`,
            total:total?total.recordCount:null
        };


        const columns = [{
                title: '订单ID',
                dataIndex: 'purchaseOrderNo',
                key: 'purchaseOrderNo',
                render: (text,record) => {
                    let linkUrl = '';
                    if(record.orderStatus == '1002'){
                        // 待付款跳转链接
                        linkUrl = `/procurement/confirmpayorder?id=${record.orderId}`;
                    }else if(record.orderStatus == '1003'){
                        // 待入库跳转链接   
                        linkUrl = `/procurement/warehouseorder?id=${record.orderId}`;
                    }else if(record.orderStatus == '1004'){
                        // 已完成的跳转链接
                        linkUrl = `/Procurement/OrderDetails?id=${record.orderId}`;
                    }else{
                        linkUrl = `/Procurement/OrderDetails?id=${record.orderId}`;
                    }
                    return <Link to={linkUrl}>{record.purchaseOrderNo}</Link>
                }
            },{
                title: '下单时间',
                dataIndex: 'modifyTiStr',
                key: 'modifyTiStr',
            },{
                title: '总金额',
                dataIndex: 'sumMoneyStr',
                key: 'sumMoneyStr',
            },{
                title: '供应商名称',
                dataIndex: 'companyName',
                key: 'companyName',
            },{
                title: '订单状态',
                dataIndex: 'orderStatusStr',
                key: 'orderStatusStr',
            },{
                title: '操作',
                key: 'id',
                render: (text, record) => {
                    if(record.orderStatus == '1002'){
                        return <a onClick={(e)=>this.handlePay(e,record)}>确认付款</a>
                    }else if(record.orderStatus == '1003'){
                        return <a onClick={(e)=>this.handleWareHose(e,record)}>确认入库</a>
                    }else{
                        return <Link to={`/Procurement/OrderDetails?id=${record.orderId}`}>详情</Link>
                    }
                },
        }];

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                let amount = 0;
                if(selectedRowKeys.length>0){
                    selectedRows.map( item => {
                        amount += parseFloat(item.sumMoneyStr);
                    })
                }
                amount = amount.toFixed(2);
                this.setState({
                    selectCount:selectedRows.length,
                    amount,
                    selectedRowKeys,
                    selectedRowKeys,
                    selectedRows
                })
            },
            selectedRowKeys:this.state.selectedRowKeys,
        };

        return (
            <div className={styles.standardTable}>
                <div className={'pb15 pt15'}>
                    {/* <Modal
                        title="导入采购订单"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={null}
                    >
                        <Steps current={-1}>
                            <Step title="下载表格模板"  />
                            <Step title="上传表格文件" />
                            <Step title="上传成功" />
                        </Steps>
                        <Dragger {...uploadProps} className={"modalUpload"}>
                            <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                        </Dragger>
                        <Button type="primary" block icon="download">下载文件模板</Button>
                    </Modal> */}
                    {/* <Button type="primary" onClick={() => handleModalVisible(true)}>新增</Button> fileList={this.state.fileList} */}
                    {/* <Upload {...uploadProps}>
                        <Button type="primary" className={'mr15'}>
                            <Icon type="upload" /> 导入采购订单
                        </Button>
                    </Upload> */}
                    <Button type="primary" className={'mr15'} onClick={this.procuremeExpertExcel}><Icon type="download" />导出采购订单</Button>
                    <Button className={'mr15'} onClick={this.batchDelete}><Icon type="delete" />批量删除</Button>
                </div>
                <Alert className={styles.tableTip} message={this.tableAlert()} type="info" showIcon />
                <Table rowSelection={rowSelection} columns={columns} rowKey="id" dataSource={list.resultInfo} pagination={paginationProps} onChange={this.handleTableChange} loading={loading} />
            </div>
        );
    }
}

export default OrderListTable;
