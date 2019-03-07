import React, { PureComponent, Fragment } from 'react';
import Link from 'umi/link';
import { Upload, Table, Alert, Button, Modal, Steps , Message, Icon } from 'antd';
import { httpHost } from '@/services/setting';
import styles from './index.less';

Message.config({
    top: 200
})

const Step = Steps.Step;

const Dragger = Upload.Dragger;

class SalesTable extends PureComponent {
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
    tableAlert = ()=> <div>已选择<b><a>{this.state.selectCount}</a></b>项  <a onClick={this.handleClear}>清空</a></div>

    // 点击供应商编辑按钮
    handleEdit = (record,fun) => {
        fun('edit');
        this.props.handleEdit(record)
    }

    // 点击新建供应商按钮
    addSupplier = (fun) => {
        fun('add');
    }

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

    // 点击导出数据
    importCustomer = () => {
        this.props.importCustomer(this.state.selectedRows)
    }

    // 点击批量删除按钮
    handleDelete = () => {
        this.props.handleDeleteCus(this.state.selectedRows);
        this.handleClear();
    }

    // 点击下载模板
    handleLoadMuban = () => {
        window.open('/客户信息导入模板.xlsx');
    }

    render() {
        const { selectedRowKeys, changingId } = this.state;
        // const rowSelection = {
        //     selectedRowKeys,
        //     onChange: this.onSelectChange,
        // };
        const { data:{customerList:{list=[],total}} , showModal , loading} = this.props;

        console.log("list====>")
        console.log(list)

        if(Object.keys(list).length){
            if(Object.keys(list.resultInfo).length == 0){
                list.resultInfo = []
            }
        }
        //上传参数
        const uploadProps = {
            //name: 'file',
            action: httpHost + '/scm/customerInfo/resolveFile',
            // headers: {
            //     authorization: 'authorization-text',
            // },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    if(info.file.response.state!=0){
                        Message.error(`${file.name} - ${info.file.response.msg}`);
                    }else{
                        Message.success(`${info.file.name} 文件上传成功`);
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
                title: '客户姓名',
                dataIndex: 'customerName',
                key: 'customerName',
            },{
                title: '地址',
                dataIndex: 'addressStr',
                key: 'addressStr',
            },{
                title: '联系方式',
                dataIndex: 'tel',
                key: 'tel',
                sorter: (a, b) => a.tel - b.tel,
            },{
                title: '客户ID',
                dataIndex: 'customerId',
                key: 'customerId',
                sorter: (a, b) => a.customerId - b.customerId,
            },{
                title: '录入时间',
                dataIndex: 'createTiStr',
                key: 'createTiStr',
                sorter: (a, b) => a.createTiStr - b.createTiStr,
            },{
                title: '操作',
                key: 'id',
                align:'center',
                render: (text, record) => {
                    return <a onClick={() => this.handleEdit(record,showModal)}>编辑</a>
                }
        }];

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectCount:selectedRows.length,
                    selectedRowKeys,
                    selectedRows
                })
            },
            selectedRowKeys:this.state.selectedRowKeys,
        };

        return (
            <div className={styles.standardTable}>
                <div className={'pb15'}>
                    {/* <Button type="primary" onClick={() => handleModalVisible(true)}>新增</Button> fileList={this.state.fileList} */}
                    <Button type="primary" icon="plus" className={'mr15'} onClick={() => this.addSupplier(showModal)}>新建客户</Button>
                    <Modal
                        title="导入数据"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={null}
                        destroyOnClose={true}
                    >
                        <Steps current={-1}>
                            <Step title="下载表格模板"  />
                            <Step title="上传表格文件" />
                            <Step title="上传成功" />
                        </Steps>
                        <Dragger {...uploadProps} className={"modalUpload"} accept=".xls,.xlsx,.xlsm,.xlt,.xltx,.xltm">
                            <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                        </Dragger>
                        <Button type="primary" block icon="download" onClick={this.handleLoadMuban}>下载文件模板</Button>
                    </Modal>
                    <Button type="primary" className={'mr15'} onClick={this.showModal}>
                        <Icon type="upload" /> 导入数据
                    </Button>
                    {/* <Upload {...uploadProps}>
                        <Button type="primary" className={'mr15'}>
                            <Icon type="upload" /> 导入供应商
                        </Button>
                    </Upload> */}
                    <Button type="primary" className={'mr15'} onClick={this.importCustomer}><Icon type="download" />导出数据</Button>
                    <Button className={'mr15'} onClick={this.handleDelete}><Icon type="delete" />批量删除</Button>
                </div>
                <Alert className={styles.tableTip} message={this.tableAlert()} type="info" showIcon />
                <Table rowSelection={rowSelection} columns={columns} rowKey="id" dataSource={list.resultInfo} pagination={paginationProps} onChange={this.handleTableChange} loading={loading} />
            </div>
        );
    }
}

export default SalesTable;
