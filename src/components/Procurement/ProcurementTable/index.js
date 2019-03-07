import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Upload, Table, Alert, Button, Notification, Message , Spin , Icon } from 'antd';
import { uploadAction } from '@/services/setting';
import styles from './index.less';
import router from 'umi/router';

Message.config({
    top: 200
})

@connect(( procurementMessage , loading) => ({
    procurementMessage
}))
class ProcurementTable extends PureComponent {
    constructor(props) {
        super(props);
        const { data } = props;
        // const needTotalList = initTotalList(columns);
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            changingId: '',
            selectCount:0,
            amount:0,
            selectedRows:[]
        };
    }

    handleTableChange = (pagination) => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(pagination);
        }
    };

    //点击清空
    handleClear = () => {
        this.setState({
            selectedRowKeys:[],
            selectedRows:[],
            selectCount:0,
            amount:0,
        })
    }

    //table提示信息
    tableAlert = ()=> <div>已选择<b><a>{this.state.selectCount}</a></b>项 总金额：<b>{this.state.amount}</b> <a onClick={this.handleClear}>清空</a></div>

    //点击编辑按钮-->进入计划单详情
    handleEdit = (r) => {
        const { dispatch } = this.props;
        dispatch({
            type:'procurementMessage/planOrderEditId',
            payload:{
                orderId: r.orderId
            },
            callback: (res) => {
                router.push(`/procurement/newProcurement?id=${r.orderId}&supplierid=${r.supplierId}`);
            }
        })
    }

    //点击转为进货单-->该订单进入采购单，消失在改页面即tabl数据重新加载
    handleTurn = (r) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'procurementMessage/changeOrderstatus',
            payload:{
                orderId:r.orderId
            }
        }).then(()=>{
            this.props.querylist();
            /*dispatch({
                type: 'procurementMessage/procureMessageList',
                payload: {

                },
            });*/
            const { procurementMessage } = this.props.procurementMessage;
            if(procurementMessage.changeOrderStatus.state == 0){
                Notification['success']({
                    message: procurementMessage.changeOrderStatus.msg,
                    duration:2
                });
            }else{
                Notification['error']({
                    message: procurementMessage.changeOrderStatus.msg,
                    duration:2
                });
            }
        })
    }

    // 点击批量删除
    batchDelete = () => {
        this.handleClear();
        this.props.batchDelete(this.state.selectedRows)
    }

    render() {
        const { data:{procureList:{list={},total={}}} , loading} = this.props;

        if(Object.keys(list).length){
            if(Object.keys(list.resultInfo).length == 0){
                list.resultInfo = []
            }
        }else{
            return <div className="example">
                        <Spin />
                    </div>
        }
        //上传参数
        const uploadProps = {
            // name: 'file',
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
                    }
                } else if (info.file.status === 'error') {
                    Message.error(`${info.file.name} 上传失败`);
                }
            },
            showUploadList: false
        };

        const paginationProps = {
            current:this.props.current,
            showTotal: () => `共 ${total.recordCount} 条记录 第 ${this.props.current} / ${total.totalPage} 页`,
            total:total?total.recordCount:null
        };

        const columns = [{
            title: '预计进货时间',
            dataIndex: 'prePurchaseTiStrs',
            key: 'prePurchaseTiStrs',
            // render: templeName => (
            //     templeName.length > 12 ? <Tooltip title={templeName}><span>{templeName.substr(0, 12)}...</span></Tooltip> : <span>{templeName}</span>
            // ),
        },
        {
            title: '供应商名称',
            dataIndex: 'companyName',
            key: 'companyName',
        },
        {
            title: '总金额',
            dataIndex: 'sumMoneyStr',
            key: 'sumMoneyStr',
        },
        {
            title: '计划制定时间',
            dataIndex: 'modifyTiStr',
            key: 'modifyTiStr',
            // sorter: (a, b) => a.lookNum - b.lookNum,
        },
        {
            title: '操作',
            key: 'id',
            render: (text, record) => (
                <Fragment>
                    <a onClick={this.handleEdit.bind(this, record)}><b>编辑</b></a>
                    <a onClick={this.handleTurn.bind(this,record)} className={styles.turnOrder}><b>转为进货单</b></a>
                </Fragment>
            ),
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
                    selectedRows
                })
            },
            selectedRowKeys:this.state.selectedRowKeys,
        };

        return (
            
            <div className={styles.standardTable}>
                <div className={'pb15'}>
                    <Button onClick={()=>{router.push('/procurement/newProcurement?id=0&supplierid=0');}} type="primary" icon="plus">新建采购计划</Button>
                    <Button icon="delete" className={styles.deleteBtn} onClick={this.batchDelete}>批量删除</Button>
                </div>
                <Alert className={styles.tableTip} message={this.tableAlert()} type="info" showIcon />
                <Table columns={columns}  rowSelection={rowSelection} rowKey="uid" dataSource={list.resultInfo} pagination={paginationProps} onChange={this.handleTableChange} loading={loading} />
            </div>
        );
    }
}

export default ProcurementTable;
