import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {Input , DatePicker, Table, Alert, Button, Message, InputNumber , Select, Modal , Row , Col , Notification , Spin} from 'antd';
import styles from './index.less';
import moment from 'moment';
import { setStorage , rmStorage , getStorage} from '../../../services/utils';
import router from 'umi/router';

Message.config({
    top: 200
})

const Option = Select.Option;
const Search = Input.Search;
const confirm = Modal.confirm;

@connect(( procurementMessage ) =>  ({
    procurementMessage
}))
class NewProcurement extends PureComponent {
    constructor(props) {
        super(props);
        const { data } = props;
        // const needTotalList = initTotalList(columns);
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            changingId: '',
            selectCount:0,
            amount:0,
            subRows:[],//所有修改需要提交的行
            visible:false,//新建采购计划模态框
            selectedRows:[],//保存所有选中的数据
            deleteDate:0,// 输入框失焦点减去重复的值 
            orderId:null,
            defaultDate:null,//初始预计进货时间
            defaultSupplierId:null,//初始供应商id
            searchValue:'',//保存搜索的字
            inputKey:Math.random(),
            current:1,
            modalCurrent:1,
            canSelect:false,
            prePurchaseTiStrsKey:Math.random()-0.1,
            purchaseAmountKey:Math.random()+0.1,
        };
    }

    componentWillMount = () => {
        const { dispatch } = this.props;
        dispatch({
            type:'procurementMessage/planOrderEditList',
            payload:{}
        })
    }

    componentDidMount = () => {
        this.handleClear();
        let query = (window.location.search).split('&');
        // 获取订单ID
        let id = parseInt(query[0].slice(query[0].indexOf('=')+1));
        // 获取供应商ID
        let supplierid = parseInt(query[1].slice(query[1].indexOf('=')+1));

        this.setState({
            canSelect:!id
        })
        const { dispatch } = this.props;
        if(getStorage('orderId')){
            id = getStorage('orderId');
        };
        this.setState({
            orderId:id,
            defaultSupplierId:supplierid
        },()=>{
            dispatch({
                type: 'procurementMessage/getSupplierInfolist',
                params:{},
            })
            this.containerPriceAmount(id)
        })
    }

    // 计算所有行对应的单价和数量
    containerPriceAmount = (id=this.state.orderId,pageNum=1) => {
        this.props.dispatch({
            type:'procurementMessage/planOrderEditlist',
            payload:{
                orderId: id,
                pageNum:pageNum,
                supplierId:this.state.defaultSupplierId
                
            }
        }).then(()=>{
            const { procurementMessage:{planOrderEditList:{list=[],total}} } = this.props.procurementMessage;
            if(list.resultInfo.length>0){
                if(list.resultInfo[0].prePurchaseTiStrs){
                    this.setState({
                        defaultDate:moment(list.resultInfo[0].prePurchaseTiStrs)
                    })
                }
                this.setState({
                    defaultSupplierId:list.resultInfo[0].supplierId,
                })
            }
            let { subRows } = this.state;
            list.resultInfo.map((item,key)=>{
                subRows[key]={};
                subRows[key].purchasePriceStr = item.purchasePriceStr?parseFloat(item.purchasePriceStr):0;
                subRows[key].rowKey = key;
                subRows[key].purchaseAmount = item.purchaseAmount?parseFloat(item.purchaseAmount):0;
            });
            this.setState({
                subRows
            })
        })
    }

    // 新建采购计划单翻页
    handleTableChange = (pagination) => {
        this.setState({
            current:pagination.current
        })
        const { dispatch } = this.props;
        this.containerPriceAmount(this.state.orderId,pagination.current)
        /*dispatch({
            type:'procurementMessage/planOrderEditlist',
            payload:{
                orderId: this.state.orderId,
                pageNum:pagination.current,
                pageSize:10,
            }
        });*/
        this.handleClear();
    };

    // 新建采购计划单模态框table
    handleModalTableChange = (pagination) => {
        this.setState({
            modalCurrent:pagination.current
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'procurementMessage/addPlanProductlist',
            payload:{
                orderId:this.state.orderId?this.state.orderId:null,
                supplierId:this.state.defaultSupplierId,
                commodityName:this.state.searchValue,
                pageSize:10,
                pageNum:pagination.current
            }
        })
    };

    //点击清空
    handleClear = () => {
        this.setState({
            selectedRowKeys:[],
            selectedRows:[],
            subRows:[],
            selectCount:0,
            amount:0,
            inputKey:Math.random()
        })
    }

    //table提示信息
    tableAlert = ()=> <div>已选择<b><a>{this.state.selectCount}</a></b>项 总金额：<b>{this.state.amount}</b> <a onClick={this.handleClear}>清空</a></div>

    //点击删除按钮
    handleEdit = (r) => {
        const { dispatch } = this.props;
        const me = this;
        confirm({
            title: '从计划单中删除商品',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'procurementMessage/planOrderEditdelete',
                    payload:{
                        detailId:r.detailId
                    }
                }).then(()=>{
                    /*dispatch({
                        type: 'procurementMessage/planOrderEditlist',
                        payload:{
                            pageNum:me.state.current,
                            orderId:me.state.orderId,
                            pageSize:10
                        }
                    })*/
                    me.containerPriceAmount();

                    const { procurementMessage } = me.props.procurementMessage;
                    if(procurementMessage.planOrderEditDelete.state == 0){
                        Notification['success']({
                            message: procurementMessage.planOrderEditDelete.msg,
                            duration:2
                        });
                        me.handleClear();
                    }else{
                        Notification['error']({
                            message: procurementMessage.planOrderEditDelete.msg,
                            duration:2
                        });
                    }
                })
            },
            onCancel() {
              //console.log('Cancel');
            },
        });
        
    }

    //点击采购单价
    priceOnChange = (record,key,value) => {
        value = value?value:0;
        let { subRows } = this.state;
        //let uid = 'sr' + record.id;
        if(Object.keys(subRows).length>0){
            for(let k in subRows){
                if(subRows[key]){
                    subRows[key].purchasePriceStr = value;
                }else{
                    subRows[key] = {
                        purchasePriceStr:value,
                        purchaseAmount:0,
                        rowKey:key
                    };
                }
            }
        }else{
            subRows[key] = {
                purchasePriceStr:value,
                purchaseAmount:0,
                rowKey:key
            };
        }
        this.setState({
            subRows
        })
    }

    //点击采购数量
    accountOnChange = (record,key,value) => {

        value = value?value:0;
        let { subRows } = this.state;
        if(Object.keys(subRows).length>0){
            for(let k in subRows){
                if(subRows[key]){
                    subRows[key].purchaseAmount = value;
                }else{
                    subRows[key] = {
                        purchasePriceStr:0,
                        purchaseAmount:value,
                        rowKey:key
                    };
                }
            }
        }else{
            subRows[key] = {
                purchasePriceStr:0,
                purchaseAmount:value,
                rowKey:key
            }; 
        }

        this.setState({
            subRows,
        })
    }

    // 点击添加商品
    addGoods = () => {
        let { defaultDate , defaultSupplierId } = this.state;
        if(!defaultDate || !defaultSupplierId){
            Message.warning("请填写预计进货时间和供应商名称");
            return false;
        }

        const { dispatch } = this.props;
        dispatch({
            type: 'procurementMessage/addPlanProductlist',
            payload:{
                orderId:this.state.orderId?this.state.orderId:null,
                supplierId:this.state.defaultSupplierId,
                commodityName:'',
                pageSize:10,
                pageNum:1
            }
        }).then(()=>{
            this.setState({
                visible: true,
            });
        })
    }
    
    // 取消加入计划弹框
    handleOk = () => {
        this.setState({ 
            visible: false
        });
    }

    // 点击取消加入计划弹框
    handleCancel = () => {
        this.setState({ visible: false });
    }

    // 点击加入计划
    handleAddPlan = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'procurementMessage/addPlanorder',
            payload:{
                supplierId:this.state.defaultSupplierId,
                commodityId:record.id,
                orderId:this.state.orderId
            }
        }).then(()=>{
            this.handleClear();
            const { procurementMessage } = this.props.procurementMessage;
            if(procurementMessage.addPlanOrder.state == 0){
                Notification['success']({
                    message: procurementMessage.addPlanOrder.msg,
                    duration:2
                });
                setStorage("orderId",procurementMessage.addPlanOrder.resultInfo);
                this.setState({
                    orderId:procurementMessage.addPlanOrder.resultInfo
                },()=>{
                    this.containerPriceAmount(procurementMessage.addPlanOrder.resultInfo);
                    dispatch({
                        type: 'procurementMessage/addPlanProductlist',
                        payload:{
                            orderId:this.state.orderId,
                            supplierId:this.state.defaultSupplierId,
                            commodityName:this.state.searchValue,
                            pageSize:10,
                            pageNum:1,
                        }
                    })
                })
            }else{
                Notification['error']({
                    message: procurementMessage.addPlanOrder.msg,
                    duration:2
                });
            }
        })
    }

    // 模态框关闭后重新加载一次采购计划列表
    afterClose = () => {
        const {dispatch} = this.props;
        /*dispatch({
            type: 'procurementMessage/planOrderEditlist',
            payload:{
                orderId:this.state.orderId
            }
        })*/
        this.containerPriceAmount();
    }

    // 计算选中行的总值
    concureTotal = () => {
        let { selectedRowKeys , subRows } = this.state;
        const { procurementMessage:{planOrderEditList:{list:{resultInfo}}}} = this.props.procurementMessage;
        let temp = [];
        selectedRowKeys.map(item=>{
            subRows.map(subItem=>{
                if(item == subItem['rowKey']){
                    let purchasePrice = subItem['purchasePriceStr'];
                    let purchaseAmount = subItem['purchaseAmount'];
                    if(!purchasePrice || !purchaseAmount){
                        return false;
                    }
                    let { orderId , detailId , commodityId } = resultInfo[item];
                    let prePurchaseTi = moment(this.state.defaultDate).format('YYYY-MM-DD');
                    let supplierId = this.state.defaultSupplierId;
                    temp.push({
                        orderId , detailId , commodityId,purchasePrice , purchaseAmount , prePurchaseTi , supplierId
                    });
                }
            })
        });
        let total = 0;
        if(temp.length>0){
            temp.map(item=>{
                total += parseFloat(item.purchaseAmount) * parseFloat(item.purchasePrice)
            });
            total = total.toFixed(2);
        }
        this.setState({
            amount:total
        })
    }

    // 数量*单价计算
    handleBlur = (record , key , e) => {
        this.concureTotal();
    }

    // 点击批量删除
    planOrderEditDeleteall = () => {
        const {dispatch } = this.props;
        let detailIds = [];
        this.state.selectedRows.map( item => {
            detailIds.push(item.detailId);
        })

        detailIds = detailIds.toString();
        if(!detailIds){
            Message.warning("请选择需要删除的行");
            return false;
        }
        const me = this;
        confirm({
            title: '从计划单删除商品',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'procurementMessage/planOrderEditDeleteall',
                    payload:{
                        detailIds
                    }
                }).then( ()=>{
                    // 刷新数据
                    /*dispatch({
                        type: 'procurementMessage/planOrderEditlist',
                        payload: {
                            pageNum:me.state.current,
                            orderId:me.state.orderId,
                            pageSize:10
                        },
                    })*/
                    me.containerPriceAmount();
                    const { procurementMessage } = me.props.procurementMessage;
                    if(procurementMessage.planOrderEditDeleteAll.state == 0){
                        Notification['success']({
                            message: procurementMessage.planOrderEditDeleteAll.msg,
                            duration:2
                        });
                        me.handleClear();
                    }else{
                        Notification['error']({
                            message: procurementMessage.planOrderEditDeleteAll.msg,
                            duration:2
                        });
                    }
                })
            },
            onCancel() {
              //console.log('Cancel');
            },
        });

    }

    // 预计进货时间改变
    dateChange = (value) => {
        this.setState({
            defaultDate:value
        })
    }

    // 点击提交订单
    handleSubmit = () => {
        const { procurementMessage:{planOrderEditList:{list:{resultInfo}}}} = this.props.procurementMessage;
        let { selectedRowKeys , subRows } = this.state;
        let temp = [];
        selectedRowKeys.map(item=>{
            subRows.map(subItem=>{
                if(item == subItem['rowKey']){
                    let purchasePrice = subItem['purchasePriceStr'];
                    let purchaseAmount = subItem['purchaseAmount'];
                    if(!purchasePrice || !purchaseAmount){
                        //Message.error(`第${subItem['rowKey']+1}行信息不完善，提交失败`);
                        return false;
                    }
                    let { orderId , detailId , commodityId } = resultInfo[item];
                    let prePurchaseTi = moment(this.state.defaultDate).format('YYYY-MM-DD').replace(/-/g,'');
                    let supplierId = this.state.defaultSupplierId;
                    temp.push({
                        orderId , detailId , commodityId,purchasePrice , purchaseAmount , prePurchaseTi , supplierId
                    });
                }
            })
        })   
        if(temp.length>0){
            const { dispatch } = this.props;
            dispatch({
                type: 'procurementMessage/planOrdersubmit',
                payload:{
                    list:temp
                }
            }).then(()=>{
                const { procurementMessage:{planOrderSubmit}} = this.props.procurementMessage;
                if(planOrderSubmit.state == 0){
                    Notification['success']({
                        message: planOrderSubmit.msg,
                        duration:2
                    });
                    
                    router.push('/procurement/planOrder');
                }else{
                    Notification['error']({
                        message: planOrderSubmit.msg,
                        duration:2
                    });
                }
            })
        }
    }

    // 点击搜索按钮
    handelSearch = (value) =>{
        const { dispatch } = this.props;
        dispatch({
            type: 'procurementMessage/addPlanProductlist',
            payload:{
                orderId:this.state.orderId,
                supplierId:this.state.defaultSupplierId,
                commodityName:value,
                pageSize:10,
                pageNum:1
            }
        })
        this.setState({
            searchValue:value,
            modalCurrent:1
        })
    }

    // 下拉框选择下来
    handleChange = (value) => {
        this.setState({
            defaultSupplierId:value
        },()=>{
            this.containerPriceAmount()
        })
    }

    componentWillUnmount = () => {
        rmStorage("orderId");
    }

    // 禁止选择的日期
    disabledDate = (current) => {
        return current.isBefore(moment(Date.now()).add(-1, 'days'))
    }

    render() {
        const { 
            procurementMessage:{planOrderEditList:{list=[],total}} ,
            procurementMessage:{addPlanProductList:{modalList=[],modalTotal}} ,
            procurementMessage:{supplierList} ,
        } = this.props.procurementMessage;

        if(Object.keys(list).length){
            if(Object.keys(list.resultInfo).length == 0){
                list.resultInfo = []
            }
        }else{
            return <div className="example">
                        <Spin />
                    </div>
        }

        if(Object.keys(modalList).length){
            if(Object.keys(modalList.resultInfo).length == 0){
                modalList.resultInfo = []
            }
        }

        const {loading} = this.props;

        const paginationProps = {
            current:this.state.current,
            showTotal: () => `共 ${total.recordCount} 条记录 第 ${this.state.current} / ${total.totalPage} 页`,
            total:total?total.recordCount:null
        };
        const paginationPropsModal = {
            current:this.state.modalCurrent,
            showTotal: () => `共 ${modalTotal.recordCount} 条记录 第 ${this.state.modalCurrent} / ${modalTotal.totalPage} 页`,
            total:modalTotal?modalTotal.recordCount:null
        };



        const columns = [{
            title: '商品编码',
            dataIndex: 'commodityCode',
            key: 'commodityCode',
            },{
                title: '商品名称',
                dataIndex: 'commodityName',
                key: 'commodityName',
            },{
                title: '规格/型号',
                dataIndex: 'commodityModel',
                key: 'commodityModel',
            },{
                title: '生产厂家',
                dataIndex: 'manufacturer',
                key: 'manufacturer',
            },{
                title: '计量单位',
                dataIndex: 'measureUnit',
                key: 'measureUnit',
            },{
                title: '采购单价',
                dataIndex: 'purchasePriceStr',
                //key: purchasePriceStrKey,
                render:(text,record,key) => {
                    return <InputNumber key={this.state.inputKey} defaultValue={text?text:0} placeholder="请输入" min={0} step={0.1} onChange={this.priceOnChange.bind(this,record,key)} onBlur={(e) => this.handleBlur(record,key,e)}/>
                } 
            },{
                title: '采购数量',
                dataIndex: 'purchaseAmount',
                //key: purchaseAmountKey,
                render:(text,record,key) => {
                    return <InputNumber key={this.state.inputKey} defaultValue={text?text:0} placeholder="请输入" min={0} step={0.1} onChange={this.accountOnChange.bind(this,record,key)} onBlur={(e) => this.handleBlur(record,key,e)}/>
                }
            },{
                title: '操作',
                key: 'id',
                render: (text, record) => (
                    <Fragment>
                        <a onClick={this.handleEdit.bind(this, record)}><b>删除</b></a>
                    </Fragment>
                ),
        }];

        // 新建采购计划表
        const columnsModal = [{
                title: '商品编码',
                dataIndex: 'commodityCode',
                key: 'commodityCode'
            },{
                title: '商品名称',
                dataIndex: 'commodityName',
                key: 'commodityName'
            },{
                title: '规格/型号',
                dataIndex: 'commodityModel',
                key: 'commodityModel'
            },{
                title: '生产厂家',
                dataIndex: 'manufacturer',
                key: 'manufacturer'
            },{
                title: '计量单位',
                dataIndex: 'measureUnit',
                key: 'measureUnit'
            },{
                title: '操作',
                key: 'id',
                render: (text, record) => (
                    <Fragment>
                        <a onClick={this.handleAddPlan.bind(this, record)}><b>加入计划</b></a>
                    </Fragment>
                ),
        }]

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectCount:selectedRowKeys.length,
                    selectedRowKeys,
                    selectedRows
                },()=>{
                    this.concureTotal()
                })
                
            },
            selectedRowKeys:this.state.selectedRowKeys,
        };

        return (
            <div>
                <Row gutter={16}>
                    <Col className="gutter-row" span={10}>
                        <div className="gutter-box">
                            <b>预计进货时间：</b>
                            <DatePicker value={this.state.defaultDate} onChange={this.dateChange} disabledDate={this.disabledDate}/> 
                        </div>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <b>供应商名称：</b>
                        {
                            supplierList.length>0?
                            <Select onChange={this.handleChange} style={{minWidth:180}} value={this.state.defaultSupplierId?this.state.defaultSupplierId:null} disabled={!this.state.canSelect} >
                                {
                                    supplierList.map( (item,k) => {
                                        return <Option value={item.supplierId} key={item.supplierId}>{item.companyName}</Option>
                                    })
                                }
                            </Select>
                            :
                            null
                            // <Select onChange={this.handleChange} style={{minWidth:180}} value={this.state.defaultSupplierId}></Select>
                        }
                        
                    </Col>
                </Row>
                <div className={styles.standardTable}>
                    <div className={'pb15'}>
                        <Button onClick={this.addGoods} type="primary" icon="plus">添加商品</Button>
                        <Button icon="delete" className={styles.deleteBtn} onClick={this.planOrderEditDeleteall.bind(this)}>批量删除</Button>
                        <Button icon={""} type="primary" className={styles.deleteBtn} onClick={this.handleSubmit}>提交</Button>
                    </div>
                    <Alert className={styles.tableTip} message={this.tableAlert()} type="info" showIcon />
                    <Table columns={columns}  rowSelection={rowSelection} rowKey="id" dataSource={list.resultInfo} pagination={paginationProps} onChange={this.handleTableChange} loading={loading} />
                </div>
                <Modal
                    visible={this.state.visible}
                    title="添加商品"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={950}
                    footer={null}
                    afterClose={this.afterClose}
                >
                    <Search
                        placeholder="请输入"
                        enterButton="搜索"
                        size="large"
                        className={styles.searchWidth}
                        onSearch={this.handelSearch}
                    />
                    {
                        modalList.resultInfo && <Table columns={columnsModal}  rowKey="modalId" onChange={this.handleModalTableChange} dataSource={modalList.resultInfo.list} pagination={paginationPropsModal} loading={loading} />
                    }
                </Modal>
            </div>
        );
    }
}

export default NewProcurement;
