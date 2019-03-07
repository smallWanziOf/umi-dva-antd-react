import React, { PureComponent, Fragment } from 'react';
import Link from 'umi/link';
import { Upload, Table, Alert, Button,  Modal , Steps , Message , Icon , Spin} from 'antd';
import { httpHost , jiejiType } from '@/services/setting';
import styles from './index.less';

Message.config({
    top: 200
})

const Step = Steps.Step;

const Dragger = Upload.Dragger;

class ProductTable extends PureComponent {
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
            selectedRows:[],
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
        const { onChange } = this.props;
        this.handleClear();
        if (onChange) {
            onChange(pagination);
        }
    };

    //table提示信息
    tableAlert = ()=> <div>已选择<b><a>{this.state.selectCount}</a></b>项  <a onClick={this.handleClear}>清空</a></div>

    // 点击供应商编辑按钮
    handleEdit = (record,fun) => {
        this.props.handleEdit(record.id);
        fun('edit')
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

    // 点击批量删除
    handleDeleteCus = () => {
        this.props.handleDeleteCus(this.state.selectedRows);
        this.handleClear();
    }

    // 点击导出数据
    importCustomer = () => {
        this.props.importCustomer(this.state.selectedRows)
    }

    // 点击下载模板
    handleLoadMuban = () => {
        window.open('/商品导入导出模版.xlsx');
    }

    render() {
        const { selectedRowKeys, changingId } = this.state;
        // const rowSelection = {
        //     selectedRowKeys,
        //     onChange: this.onSelectChange,
        // };
        const { handleModalVisible, onDownload, onSwitch, changingStatus, data:{productList:{list=[],total}}, loading , showModal} = this.props;

        if(Object.keys(list).length){
            if(Object.keys(list.resultInfo).length == 0){
                list.resultInfo = []
            }
        }else{
            return  <div className="example">
                        <Spin />
                    </div>
        }

        const me = this;

        //上传参数
        const uploadProps = {
            name: 'file',
            action: jiejiType + '/scm/commodityInfo/resolveFile',
            // headers: {
            //     authorization: 'authorization-text',
            // },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    if(info.file.response.state!=0){
                        Message.error(`${info.file.name} - ${info.file.response.msg}`);
                    }else{
                        Message.success(`${info.file.name} 文件上传成功`);
                        me.props.reloadTable();
                    }
                } else if (info.file.status === 'error') {
                    Message.error(`${info.file.name} 上传失败`);
                }
            }
        };

        const paginationProps = {
            current:this.props.current,
            showTotal: () => `共 ${total.recordCount} 条记录 第 ${this.props.current} / ${total.totalPage} 页`,
            total:total?total.recordCount:null,
        };

        const columns = [{
                title: '商品名称',
                dataIndex: 'commodityName',
                key: 'commodityName',
            },{
                title: '规格/型号',
                dataIndex: 'commodityModel',
                key: 'commodityModel',
            },{
                title: '计量单位',
                dataIndex: 'measureUnit',
                key: 'measureUnit',
            },{
                title: '供应商',
                dataIndex: 'companyName',
                key: 'companyName',
            },{
                title: '采购价',
                dataIndex: 'purchasePriceStr',
                key: 'purchasePriceStr',
            },{
                title: '操作',
                key: 'id',
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
                <div className={'pb15 pt15'}>
                    <Modal
                        title="导入商品"
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
                    {/* <Button type="primary" onClick={() => handleModalVisible(true)}>新增</Button> fileList={this.state.fileList} */}
                    <Button type="primary" icon="plus" className={'mr15'} onClick={() => this.addSupplier(showModal)}>新建商品</Button>
                    <Button type="primary" className={'mr15'} onClick={this.showModal}>
                        <Icon type="upload" /> 导入商品
                    </Button>
                    {/* <Upload {...uploadProps}>
                        <Button type="primary" className={'mr15'}>
                            <Icon type="upload" /> 导入商品
                        </Button>
                    </Upload> */}
                    <Button type="primary" className={'mr15'} onClick={this.importCustomer}><Icon type="download" />导出商品</Button>
                    <Button className={'mr15 mt15'} onClick={this.handleDeleteCus}><Icon type="delete" />批量删除</Button>
                </div>
                <Alert className={styles.tableTip} message={this.tableAlert()} type="info" showIcon />
                <Table rowSelection={rowSelection} columns={columns} rowKey="pid" dataSource={list.resultInfo} pagination={paginationProps} onChange={this.handleTableChange} loading={loading} />
            </div>
        );
    }
}

export default ProductTable;
