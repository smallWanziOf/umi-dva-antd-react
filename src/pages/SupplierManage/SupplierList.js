import router from 'umi/router';
import { Button, Modal , Card, Spin , Notification , Message} from 'antd';
import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
import SupplierSearch from '@/components/SupplierManage/SupplierSearch';
import SupplierTable from '@/components/SupplierManage/SupplierTable';
import SupplierModal from '@/components/SupplierManage/SupplierModal';
import { httpHost } from '../../services/setting';
import chinaDivision from '@/services/chinaDivision.js';

Message.config({
    top: 200
})

@connect(({ supplierMessage, loading }) => ({
    supplierMessage,
    loading: loading.models.supplierMessage,
}))
class SupplierList extends React.PureComponent {
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
            type: 'supplierMessage/supplierMessageList',
            payload: {
                pageNum:1,
                pageSize:10
            },
        })
    }

    // 查询搜索
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
            type: 'supplierMessage/supplierMessageList',
            payload: {
                ...params,
                pageNum:1,
                pageSize:10
            },
        });
    }

    // 翻页
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
            type: 'supplierMessage/supplierMessageList',
            payload: params,
        });
    };


    // 刷新table数据
    reloadTable =  () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'supplierMessage/supplierMessageList',
            payload: {}
        })
    }


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
            /*dispatch({
                type:'customerMessage/getAddresslist',
                payload:{},
                callback: (res)=>{
                    let temp = res.resultInfo;
                    temp.map( (item, key)=>{
                        temp[key]['value'] = item['adcode'];
                        temp[key]['label'] = item['name'];
                        temp[key]['isLeaf'] = false;
                    })
                    this.setState({
                        visible: true,
                        options: temp
                    });
                }
            })*/
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

    // 点击提交新建客户信息
    addSupplier = (params) => {
        const { dispatch } = this.props;
        /*let ca = params.companyAddress;

        if(Array.isArray(ca)){
            params['province'] = ca[0];
            params['city'] = ca[1];
            params['district'] = ca[2];
        }
        delete params.companyAddress;*/
        dispatch({
            type: 'supplierMessage/addsupplier',
            payload: params,
        }).then(() => {
            this.querylist();
            const { supplierMessage } = this.props;
            if(supplierMessage.addSupplier.state == 0){
                Notification['success']({
                    message: supplierMessage.addSupplier.msg,
                    duration:2
                });
            }else{
                Notification['error']({
                    message: supplierMessage.addSupplier.msg,
                    duration:2
                });
            }
        })
    }

    // 点击提交编辑客户信息内容
    editSaveSupplier = (params) => {
        const { dispatch } = this.props;
        /*let ca = params.companyAddress;
        if(Array.isArray(ca)){
            params['province'] = ca[0];
            params['city'] = ca[1];
            params['district'] = ca[2];
        }
        delete params.companyAddress;*/

        dispatch({
            type: 'supplierMessage/editSavesupplier',
            payload: params,
        }).then(() => {
            this.querylist();
            const { supplierMessage } = this.props;
            if(supplierMessage.editSaveSupplier.state == 0){
                Notification['success']({
                    message: supplierMessage.editSaveSupplier.msg,
                    duration:2
                });
            }else{
                Notification['error']({
                    message: supplierMessage.editSaveSupplier.msg,
                    duration:2
                });
            }
        })
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

    // 点击编辑供应商信息
    handleEdit = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type:'supplierMessage/supplieredit',
            payload:{
                supplierId:record.supplierId
            },
            callback: (res) => {
                let { resultInfo } = res
                this.setState({
                    addressCode:resultInfo,
                    visible:true
                })
                /*let { resultInfo } = res;
                if(resultInfo['province']){
                    this.setState({
                        addressCode:resultInfo,
                    },()=>{
                        this.editAddress(1,resultInfo['province']);
                    })
                }else{
                    this.seState({
                        visible:true
                    })
                }*/
            }
        })
    }

    // 重置搜索条件
    handleResetState = () => {
        this.setState({
            searchlist:null
        })
    }

    // 点击客户信息导出
    importSupplier = (param=[]) => {
        const form = document.createElement('form');
        form.id = 'form-file-download';
        form.name = 'form-file-download';
        // 添加到 body 中
        document.body.appendChild(form);
        const { searchlist } = this.state;
        for (const key in searchlist) {
          if (searchlist[key]!== undefined && Object.hasOwnProperty.call(searchlist, key)) {
            // 创建一个输入
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = searchlist[key];
            form.appendChild(input);
          }
        }
        // form 的提交方式
        form.method = 'POST';
        //跳转新页面
        //form.target = '_blank'
        // form 提交路径
        form.action = `${httpHost}/scm/supplierInfo/expertExcel`;
        form.submit();
        document.body.removeChild(form);
        /*if(!this.state.searchlist){
            Message.warning('请添加搜索条件');
            return false;
        }
        const {dispatch} = this.props;
        dispatch({
            type: 'supplierMessage/importsupplier',
            payload:{...this.state.searchlist}
        }).then(()=>{
            const { supplierMessage } = this.props;
            if(supplierMessage.importSupplier.state == 0){
                Notification['success']({
                    message: supplierMessage.importSupplier.msg,
                    duration:2
                });
            }else{
                Notification['error']({
                    message: supplierMessage.importSupplier.msg,
                    duration:2
                });
            }
        })*/
    }

    // 点击批量删除
    handleDeleteCus = (param=[]) => {
        const {dispatch } = this.props;
        let supplierIds = [];
        param.map( item => {
            supplierIds.push(item.supplierId);
        })

        supplierIds = supplierIds.toString();

        if(!supplierIds){
            Message.warning("请选择需要删除的行");
            return false;
        }

        dispatch({
            type: 'supplierMessage/deletesupplier',
            payload:{
                supplierIds
            }
        }).then( ()=>{
            // 刷新数据
            this.querylist();
            const { supplierMessage } = this.props;
            if(supplierMessage.deleteSupplier.state == 0){
                Notification['success']({
                    message: supplierMessage.deleteSupplier.msg,
                    duration:2
                });
            }else{
                Notification['error']({
                    message: supplierMessage.deleteSupplier.msg,
                    duration:2
                });
            }
        })
  
    }

    // 获取编辑信息三级联动的地址
    /*editAddress = (count,adcode) => {
        const { dispatch } = this.props;
        //adcode = '310000';
        let pcode = 100000;
        if(count == 2){
            pcode = this.state.options[0].value
        }else if(count == 3){
            pcode = this.state.options[0]['children'][0].value
        }else if(count > 3){
            return false;
        }
        dispatch({
            type:'customerMessage/getAddresslist',
            payload:{
                pcode:pcode
            },
            callback: (res)=>{
                let tempOptions = this.state.options;
                let temp = res.resultInfo;
                temp.map( (item, key)=>{
                    if(item['adcode'] == adcode){
                       if(count == 1){
                            tempOptions[0] = {
                                value: item['adcode'],
                                label: item['name'],
                                isLeaf:false,
                                children:[]
                            }
                            this.setState({
                                options:tempOptions,
                            },()=>{
                                this.editAddress(2,this.state.addressCode['city'])
                            })
                        }else if(count == 2){
                            tempOptions[0]['children'][0] = {
                                value: item['adcode'],
                                label: item['name'],
                                isLeaf:false,
                                children:[]
                            }
                            this.setState({
                                options:tempOptions,
                            },()=>{
                                this.editAddress(3,this.state.addressCode['district'])
                            })
                        }else{
                            tempOptions[0]['children'][0]['children'][0] = {
                                value: item['adcode'],
                                label: item['name'],
                            }
                            this.setState({
                                options:tempOptions,
                                visible:true
                            })
                        }
                    }
                })
                if(!this.state.visible){
                    dispatch({
                        type:'customerMessage/getAddresslist',
                        payload:{},
                        callback: (res)=>{
                            let temp = res.resultInfo;
                            temp.map( (item, key)=>{
                                temp[key]['value'] = item['adcode'];
                                temp[key]['label'] = item['name'];
                                temp[key]['isLeaf'] = false;
                            })
                            this.setState({
                                visible: true,
                                options: temp
                            });
                        }
                    })
                    Message.error("地址信息有误，请重新编辑提交")
                    this.setState({
                        visible:true
                    })
                }
            }
        })
    }*/

    render() {
        const {
            supplierMessage,
            loading,
            tableLoading,
        } = this.props;
        const { iduClass, changingStatus , modalType } = this.state;
        // const datass = { "state": 0, "msg": "", "resultInfo": { "pagination": { "current": 1, "pageSize": 10, "total": 5 }, "list": [{ "id": 22, "templeName": "测试00133344", "tradeType": 1002, "renovateTime": 20181228173338606, "lookNum": 0, "downloadNum": 8, "start": 1001, "fileId": "a531edeabdd4e438abf3d06832770160", "fileName": "八戒财税.docx", "fileSize": 3669489, "format": "docx", "del": null, "url": "http://fileserver.jieshui8.org/file/download/a531edeabdd4e438abf3d06832770160/1546395290346", "tradeTypeStr": "劳动人事", "renovateTimeStr": "2018-12-28 17:33:38" }, { "id": 23, "templeName": "测试", "tradeType": 1005, "renovateTime": 20181228165614111, "lookNum": 0, "downloadNum": 0, "start": 1002, "fileId": "78128d639f62ef0898bab8b5e4a652f4", "fileName": "Group2.png", "fileSize": 10213, "format": "png", "del": null, "url": "http://fileserver.jieshui8.org/file/download/78128d639f62ef0898bab8b5e4a652f4/1546395290348", "tradeTypeStr": "抵押担保", "renovateTimeStr": "2018-12-28 16:56:14" }, { "id": 24, "templeName": "测试3", "tradeType": 1003, "renovateTime": 20181228165615863, "lookNum": 0, "downloadNum": 1, "start": 1002, "fileId": "9c92edf6d74339d5fd3d0f20f244077d", "fileName": "Group3.png", "fileSize": 8575, "format": "png", "del": null, "url": "http://fileserver.jieshui8.org/file/download/9c92edf6d74339d5fd3d0f20f244077d/1546395290349", "tradeTypeStr": "知识产权", "renovateTimeStr": "2018-12-28 16:56:15" }, { "id": 25, "templeName": "测试5", "tradeType": 1002, "renovateTime": 20181228165617245, "lookNum": 0, "downloadNum": 0, "start": 1002, "fileId": null, "fileName": null, "fileSize": null, "format": null, "del": null, "url": null, "tradeTypeStr": "劳动人事", "renovateTimeStr": "2018-12-28 16:56:17" }, { "id": 26, "templeName": "1", "tradeType": 1007, "renovateTime": 20181228165619777, "lookNum": 0, "downloadNum": 0, "start": 1001, "fileId": null, "fileName": null, "fileSize": null, "format": null, "del": null, "url": null, "tradeTypeStr": "工程-建筑-技术", "renovateTimeStr": "2018-12-28 16:56:19" }] } }
        // const datas = datass.resultInfo
        // console.log(loading && !tableLoading)
        return (
            <div>
                <Card bordered={false} className={'mainBox'}>
                    <SupplierSearch
                        onRef={this.onRef}
                        querylist={this.querylist}
                        iduClass={iduClass} 
                        handleResetState={this.handleResetState}
                        />
                    <SupplierTable
                        current={this.state.current}
                        loading={loading}
                        data={supplierMessage}
                        handleModalVisible={this.handleModalVisible}
                        onChange={this.handleStandardTableChange.bind(this)}
                        showModal={this.showModal}
                        handleEdit={this.handleEdit}
                        importSupplier={this.importSupplier}
                        handleDeleteCus={this.handleDeleteCus}
                        reloadTable={this.reloadTable}
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
                    <SupplierModal
                        chinaDivision={chinaDivision}
                        modalType={modalType}
                        data={supplierMessage}
                        addSupplier={this.addSupplier}
                        onCancel={this.handleCancel}
                        editSaveSupplier={this.editSaveSupplier}
                        options={this.state.options}
                        loadData={this.loadData}
                    />
                </Modal>
                {/* <Spin spinning={loading && !tableLoading && !changingStatus} /> */}
            </div>
        );
    }
}
export default SupplierList