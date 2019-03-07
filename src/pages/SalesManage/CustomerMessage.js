import router from 'umi/router';
import { Notification , Modal , Card, Spin , Message } from 'antd';
import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
import SalesSearch from '@/components/SalesManage/SalesSearch';
import SalesTable from '@/components/SalesManage/SalesTable';
import SalesModal from '@/components/SalesManage/SalesModal';
import { PaatDataContractTemple } from '../../services/setting';
import chinaDivision from '@/services/chinaDivision.js';

Message.config({
    top: 200
})

@connect(({ customerMessage, loading }) => ({
    customerMessage,
    loading: loading.models.customerMessage,
    tableLoading: loading.effects['customerMessage/customerList'],
}))
class CustomerMessage extends React.PureComponent {
    state = {
        modalVisible: false,
        stepFormValues: {},
        pagination: {},
        searchlist: null,
        valueType: '',
        iduClass: {},
        visible: false,
        modalType:'add',// 打开模态框的类型 新建 | 编辑
        options:[],
        addressCode:{},
        current:1,
    };

    //初始化获取
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'customerMessage/customerMessageList',
            payload: {
                pageNum:1,
                pageSize:10
            },
        })
    }

    // 重置搜索条件
    handleResetState = () => {
        this.setState({
            searchlist:null
        })
    }

    // 查询重置
    querylist = (res=this.state.searchlist) => {
        const { dispatch } = this.props;
        const params = {
            ...res,
        }
        this.setState({
            searchlist: res,
            current:1,
        });
        dispatch({
            type: 'customerMessage/customerMessageList',
            payload: {
                ...params,
                pageNum:1,
                pageSize:10,
            },
        });
    }

    // 表单翻页
    handleStandardTableChange = (pagination) => {
        const { dispatch } = this.props;
        const paginations = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize,
        };
        this.setState({
            pagination: paginations,
            current:pagination.current
        });
        const { searchlist } = this.state;
        const params = {
            ...searchlist,
            ...paginations
        };
        dispatch({
            type: 'customerMessage/customerMessageList',
            payload: params,
        });
    };

    // 弹出框
    handleModalVisible = (flag, record) => {
        const { dispatch } = this.props;
        if (record) {
            const params = '?templeId=' + record.id;
            dispatch({
                type: 'contract/getLoglist',
                payload: params,
            });
        }
        let typeName = '合同模板-新增';
        if (!!record) {
            typeName = record.templeName + '-编辑';
        }
        this.setState({
            modalVisible: !!flag,
            valueType: typeName,
            stepFormValues: record || {},
        });
    };

    // 开关
    onSwitch = (isChecked, id) => {
        //1001 启用中  //1002 已停用
        // console.log(isChecked);
        // console.log(id,start,2)
        this.setState({ changingStatus: true });
        const { dispatch } = this.props;
        const { searchlist, pagination } = this.state;
        let newstart = null
        if (isChecked) {
            newstart = 1001;
            // console.log('new',start,newstart)
        } else {
            newstart = 1002;
            // console.log('new',start,newstart)
        }
        const params = {
            start: newstart,
            id
        };
        const paramslist = {
            ...searchlist,
            ...pagination,
        };
        dispatch({
            type: 'contract/contractadd',
            payload: params,
            // payloadlist: paramslist,
        }).then(res => {
            if (res == 0) {
                // dispatch({
                //     type: 'contract/contractlist',
                //     payload: paramslist
                // });
            }
            this.setState({ changingStatus: false });
        });
    }

    // 新增或编辑模板
    handleAdd = (fields, uploadInfo, id) => {
        const { searchlist, pagination } = this.state;
        // if (fields.uploadContract) {
        //     if (fields.uploadContract.file.response.result === 0) {
        //         message.error(fields.uploadContract.file.response.msg);
        //         return
        //     }
        // }
        const addid = id ? id : '';
        const params = {
            templeName: fields.templeName,
            tradeType: fields.tradeType ? parseInt(fields.tradeType) : '',

            fileName: uploadInfo.fileName || undefined,
            fileId: uploadInfo.fileId || undefined,
            fileSize: uploadInfo.fileSize || undefined,
            format: uploadInfo.extName || undefined,

            start: 1001,
            id: addid
        };

        const paramslist = {
            ...searchlist,
            ...pagination,
        };

        const { dispatch } = this.props;
        dispatch({
            type: 'contract/contractadd',
            payload: params,
            payloadlist: paramslist,
        }).then((ret) => {
            console.log(ret)
            if (ret == 0) {
                this.handleCancels();
                dispatch({
                    type: 'contract/contractlist',
                    payload: {},
                });
            }
        });

    };

    // 弹框关闭
    handleCancels = () => {
        this.setState({
            modalVisible: false,
            stepFormValues: {}
        });
    };

    showModal = (type) => {
        const { dispatch } = this.props;
        this.setState({
            modalType:type,
        });
        if(type === "add"){
            this.setState({
                visible: true,
            });
            // dispatch({
            //     type:'customerMessage/getAddresslist',
            //     payload:{},
            //     callback: (res)=>{
            //         let temp = res.resultInfo;
            //         temp.map( (item, key)=>{
            //             temp[key]['value'] = item['adcode'];
            //             temp[key]['label'] = item['name'];
            //             temp[key]['isLeaf'] = false;
            //         })
            //         this.setState({
            //             visible: true,
            //             options: temp
            //         });
            //     }
            // })
        }
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

    // 点击编辑客户信息
    handleEdit = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type:'customerMessage/customeredit',
            payload:{
                customerId:record.customerId
            },
            callback: (res) => {
                this.setState({
                    visible:true
                })
                // let { resultInfo } = res;

                // if(resultInfo['province']){
                //     this.setState({
                //         addressCode:resultInfo,
                //     },()=>{
                //         this.editAddress(1,resultInfo['province']);
                //     })
                // }else{
                    
                // }
            }
        })
    }

    // 获取编辑信息三级联动的地址
    // editAddress = (count,adcode) => {
    //     const { dispatch } = this.props;
    //     let pcode = 100000;
    //     if(count == 2){
    //         pcode = this.state.options[0].value
    //     }else if(count == 3){
    //         pcode = this.state.options[0]['children'][0].value
    //     }else if(count > 3){
    //         return false;
    //     }
    //     dispatch({
    //         type:'customerMessage/getAddresslist',
    //         payload:{
    //             pcode:pcode
    //         },
    //         callback: (res)=>{
    //             let tempOptions = this.state.options;
    //             let temp = res.resultInfo;
    //             temp.map( (item, key)=>{
    //                 if(item['adcode'] == adcode){
    //                    if(count == 1){
    //                         tempOptions[0] = {
    //                             value: item['adcode'],
    //                             label: item['name'],
    //                             isLeaf:false,
    //                             children:[]
    //                         }
    //                         this.setState({
    //                             options:tempOptions,
    //                         },()=>{
    //                             this.editAddress(2,this.state.addressCode['city'])
    //                         })
    //                     }else if(count == 2){
    //                         tempOptions[0]['children'][0] = {
    //                             value: item['adcode'],
    //                             label: item['name'],
    //                             isLeaf:false,
    //                             children:[]
    //                         }
    //                         this.setState({
    //                             options:tempOptions,
    //                         },()=>{
    //                             this.editAddress(3,this.state.addressCode['district'])
    //                         })
    //                     }else{
    //                         tempOptions[0]['children'][0]['children'][0] = {
    //                             value: item['adcode'],
    //                             label: item['name'],
    //                         }
    //                         this.setState({
    //                             options:tempOptions,
    //                             visible:true
    //                         })
    //                     }
    //                 };
    //             });
    //             if(!this.state.visible){
    //                 dispatch({
    //                     type:'customerMessage/getAddresslist',
    //                     payload:{},
    //                     callback: (res)=>{
    //                         let temp = res.resultInfo;
    //                         temp.map( (item, key)=>{
    //                             temp[key]['value'] = item['adcode'];
    //                             temp[key]['label'] = item['name'];
    //                             temp[key]['isLeaf'] = false;
    //                         })
    //                         this.setState({
    //                             visible: true,
    //                             options: temp
    //                         });
    //                     }
    //                 })
    //                 Message.error("地址信息有误,请重新编辑提交")
    //                 this.setState({
    //                     visible:true
    //                 })
    //             }
    //         }
    //     })
    // }

    // 点击提交新建客户信息
    addCustomer = (params) => {
        const { dispatch } = this.props;
        let ca = params.customerAddress;
        if(Array.isArray(ca)){
            params['province'] = ca[0];
            params['city'] = ca[1];
            params['district'] = ca[2];
        }
        delete params.customerAddress;
        dispatch({
            type: 'customerMessage/addcustomer',
            payload: params,
        }).then(() => {
            this.querylist();
            const { customerMessage } = this.props;
            if(customerMessage.addCustomer.state == 0){
                Notification['success']({
                    message: customerMessage.addCustomer.msg,
                    duration:2
                });
            }else{
                Notification['error']({
                    message: customerMessage.addCustomer.msg,
                    duration:2
                });
            }
        })
    }

    // 点击提交编辑客户信息内容
    editSaveCustomer = (params) => {
        const { dispatch } = this.props;
        let ca = params.customerAddress;
        if(Array.isArray(params.customerAddress)){
            params['provinceId'] = ca[0];
            params['cityId'] = ca[1];
            params['districtId'] = ca[2];
        }
        dispatch({
            type: 'customerMessage/editSavecustomer',
            payload: params,
        }).then(() => {
            this.querylist();
            const { customerMessage } = this.props;
            if(customerMessage.editSaveCustomer.state == 0){
                Notification['success']({
                    message: customerMessage.editSaveCustomer.msg,
                    duration:2
                });
            }else{
                Notification['error']({
                    message: customerMessage.editSaveCustomer.msg,
                    duration:2
                });
            }
        })
    }

    // 点击客户信息导出
    importCustomer = (param=[]) => {
        if(!this.state.searchlist){
            Message.warning('请添加搜索条件');
            return false;
        }
        const {dispatch} = this.props;
        dispatch({
            type: 'customerMessage/importcustomer',
            payload:{...this.state.searchlist}
        }).then(()=>{
            const { customerMessage } = this.props;
            if(customerMessage.importCustomer.state == 0){
                Notification['success']({
                    message: customerMessage.importCustomer.msg,
                    duration:2
                });
            }else{
                Notification['error']({
                    message: customerMessage.importCustomer.msg,
                    duration:2
                });
            }
        })
    }

    // 点击批量删除
    handleDeleteCus = (param=[]) => {
        const {dispatch , customerMessage} = this.props;
        let customerIds = [];
        param.map( item => {
            customerIds.push(item.customerId);
        })

        customerIds = customerIds.toString();

        if(!customerIds){
            Message.warning("请选择需要删除的行");
            return false;
        }

        dispatch({
            type: 'customerMessage/deletecustomer',
            payload:{
                customerIds
            }
        }).then( ()=>{
            // 刷新数据
            this.querylist();
            const { customerMessage } = this.props;
            if(customerMessage.deleteCustomer.state == 0){
                Notification['success']({
                    message: customerMessage.deleteCustomer.msg,
                    duration:2
                });
            }else{
                Notification['error']({
                    message: customerMessage.deleteCustomer.msg,
                    duration:2
                });
            }
        })
  
    }

    // 地址三级下拉
    // getAddressList = (selectedOptions) =>{
    //     dispatch({
    //         type:'customerMessage/getAddresslist',
    //         payload:{
    //             customerId:record.customerId
    //         }
    //     })
    // }

    // 下拉改变
    optionsChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
    }

    // 地址下来动态数组加载
    loadData = (selectedOptions) => {
        const { dispatch } = this.props;

        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
    
        dispatch({
            type:'customerMessage/getAddresslist',
            payload:{
                pcode:selectedOptions[0].pcode
            },
            callback: (res)=>{
                let temp = res.resultInfo;
                if(selectedOptions.length<2){
                    temp.map( (item, key)=>{
                        temp[key]['value'] = item['adcode'];
                        temp[key]['label'] = item['name'];
                        temp[key]['isLeaf'] = false;
                    })
                }else{
                    temp.map( (item, key)=>{
                        temp[key]['value'] = item['adcode'];
                        temp[key]['label'] = item['name'];
                    })
                }
                targetOption.loading = false;
                targetOption.children = [...temp];
                this.setState({
                    options: [...this.state.options],
                });
            }
        })
    }

    render() {
        const {
            customerMessage,
            loading
        } = this.props;
        const { iduClass , modalType } = this.state;
        // const datass = { "state": 0, "msg": "", "resultInfo": { "pagination": { "current": 1, "pageSize": 10, "total": 5 }, "list": [{ "id": 22, "templeName": "测试00133344", "tradeType": 1002, "renovateTime": 20181228173338606, "lookNum": 0, "downloadNum": 8, "start": 1001, "fileId": "a531edeabdd4e438abf3d06832770160", "fileName": "八戒财税.docx", "fileSize": 3669489, "format": "docx", "del": null, "url": "http://fileserver.jieshui8.org/file/download/a531edeabdd4e438abf3d06832770160/1546395290346", "tradeTypeStr": "劳动人事", "renovateTimeStr": "2018-12-28 17:33:38" }, { "id": 23, "templeName": "测试", "tradeType": 1005, "renovateTime": 20181228165614111, "lookNum": 0, "downloadNum": 0, "start": 1002, "fileId": "78128d639f62ef0898bab8b5e4a652f4", "fileName": "Group2.png", "fileSize": 10213, "format": "png", "del": null, "url": "http://fileserver.jieshui8.org/file/download/78128d639f62ef0898bab8b5e4a652f4/1546395290348", "tradeTypeStr": "抵押担保", "renovateTimeStr": "2018-12-28 16:56:14" }, { "id": 24, "templeName": "测试3", "tradeType": 1003, "renovateTime": 20181228165615863, "lookNum": 0, "downloadNum": 1, "start": 1002, "fileId": "9c92edf6d74339d5fd3d0f20f244077d", "fileName": "Group3.png", "fileSize": 8575, "format": "png", "del": null, "url": "http://fileserver.jieshui8.org/file/download/9c92edf6d74339d5fd3d0f20f244077d/1546395290349", "tradeTypeStr": "知识产权", "renovateTimeStr": "2018-12-28 16:56:15" }, { "id": 25, "templeName": "测试5", "tradeType": 1002, "renovateTime": 20181228165617245, "lookNum": 0, "downloadNum": 0, "start": 1002, "fileId": null, "fileName": null, "fileSize": null, "format": null, "del": null, "url": null, "tradeTypeStr": "劳动人事", "renovateTimeStr": "2018-12-28 16:56:17" }, { "id": 26, "templeName": "1", "tradeType": 1007, "renovateTime": 20181228165619777, "lookNum": 0, "downloadNum": 0, "start": 1001, "fileId": null, "fileName": null, "fileSize": null, "format": null, "del": null, "url": null, "tradeTypeStr": "工程-建筑-技术", "renovateTimeStr": "2018-12-28 16:56:19" }] } }
        // const datas = datass.resultInfo
        // console.log(loading && !tableLoading)
        return (
            <div>
                <Card bordered={false} className={'mainBox'}>
                    <SalesSearch
                        onRef={this.onRef}
                        querylist={this.querylist}
                        iduClass={iduClass} 
                        handleResetState={this.handleResetState}
                        />
                    <SalesTable
                        current={this.state.current}
                        loading={loading}
                        data={customerMessage}
                        handleModalVisible={this.handleModalVisible}
                        onDownload={this.onDownload}
                        onChange={this.handleStandardTableChange.bind(this)}
                        showModal={this.showModal}
                        handleEdit={this.handleEdit}
                        importCustomer={this.importCustomer}
                        handleDeleteCus={this.handleDeleteCus}
                    />
                </Card>
                <Modal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={950}
                    footer={null}
                    destroyOnClose={true}
                >
                    <SalesModal 
                        data={customerMessage}
                        onCancel={this.handleCancel}
                        chinaDivision={chinaDivision}
                        modalType={modalType}
                        addCustomer={this.addCustomer}
                        editSaveCustomer={this.editSaveCustomer}
                        options={this.state.options}
                        loadData={this.loadData}
                        optionsChange={this.optionsChange}
                    />
                </Modal>
            </div>
        );
    }
}
export default CustomerMessage