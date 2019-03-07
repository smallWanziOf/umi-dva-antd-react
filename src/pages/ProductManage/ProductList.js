import router from 'umi/router';
import { Button, Modal , Card, Spin , Notification , Message} from 'antd';
import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
import ProductSearch from '@/components/ProductManage/ProductSearch';
import ProductTable from '@/components/ProductManage/ProductTable';
import ProductModal from '@/components/ProductManage/ProductModal';
import { pictureSouce , httpHost } from '@/services/setting';

Message.config({
    top: 200
})

@connect(({ productMessage, loading }) => ({
    productMessage,
    loading: loading.models.productMessage,
    //tableLoading: loading.effects['productMessage/productMessageList'],
}))
class ProductList extends React.PureComponent {

    state = {
        modalVisible: false,
        stepFormValues: {},
        pagination: {},
        searchlist: null,
        valueType: '',
        iduClass: {},
        visible: false,
        modalType:'add',// 打开模态框的类型 新建 | 编辑
        canUpload:false,
        fileList:[],
        current:1,
        previewVisible: false,
        previewImage: '',
        fileList: [/*{
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }*/],
        changeStatus:false
    };

    //初始化获取
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'productMessage/productMessageList',
            payload: {
                pageNum:1,
                pageSize:10
            },
        })
    }

    // 调用函数
    getContractData = () => {
        const { dispatch } = this.props;
        const { searchlist, pagination } = this.state;
        const params = {
            ...searchlist,
            ...pagination,
        };
        dispatch({
            type: 'contract/contractlist',
            payload: params,
        });

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
            type: 'productMessage/productMessageList',
            payload: {
                ...params,
                pageNum:1,
                pageSize:10
            }
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
            type: 'productMessage/productMessageList',
            payload: params,
        });
    };

    // 弹出框
    handleModalVisible = (flag, record) => {

    };

    // 开关
    onSwitch = (isChecked, id) => {

    }

    // // 弹框关闭
    // handleCancels = () => {
    //     this.setState({
    //         modalVisible: false,
    //         stepFormValues: {},
    //     });
    // };

    //下载
    onDownload = (record) => {

    }

    showModal = (type) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productMessage/getSupplierInfolist',
            params:{},
        }).then(()=>{
            this.setState({
                modalType:type,
                visible:true
            });
        })
    }
    
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {

        this.setState({
            visible: false,
            fileList:[]
        });
    }

    // 点击编辑商品信息
    handleEdit = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type:'productMessage/productedit',
            payload:{
                id
            },
            callback: (res) => {
                let { commodityInfoVO } = res.resultInfo;
                if(commodityInfoVO.fileId){
                    let { fileList } = this.state;
                    let drc = commodityInfoVO.fileId.slice(0,3);
                    fileList = [{
                        uid: commodityInfoVO.fileId,
                        name: commodityInfoVO.fileName + '.' +commodityInfoVO.fileFormat,
                        status: 'done',
                        url: `${pictureSouce}/${drc}/${commodityInfoVO.fileId}.${commodityInfoVO.fileFormat}`,
                    }]
                    this.setState({
                        fileList,
                        modalType:'edit',
                        visible: true
                    })
                }
            }
        })
    }

    // 点击提交编辑客户信息内容
    editSaveProduct = (params) => {
        params['purchasePrice'] = params['purchasePriceStr'];
        delete params.purchasePriceStr;
        const { dispatch } = this.props;
        let { fileList } = this.state;
        let tempList = {};
        if(fileList.length && fileList[0]['response']){
            tempList = {
                fileId:fileList[0]['response'].fileId,
                fileName:fileList[0]['response'].fileName,
                fileFormat:fileList[0]['response'].extName,
            }
        }else{
            tempList = {
                fileId:null,
                fileName:null,
                fileFormat:null,
            }
        }
        params = {
            ...params,
            ...tempList
        }
        dispatch({
            type: 'productMessage/editSaveproduct',
            payload: params,
            callback: (res) => {
                if(res){
                    this.querylist();
                    if(res.state == 0){
                        Notification['success']({
                            message: res.msg,
                            duration:2
                        });
                    }else{
                        Notification['error']({
                            message: res.msg,
                            duration:2
                        });
                    }
                }
            } 
        })
    }

    // 点击提交新建客户信息
    addProduct = (params) => {
        const { dispatch } = this.props;
        params['purchasePrice'] = params['purchasePriceStr'];
        delete params.purchasePriceStr;
        let { fileList } = this.state;
        let tempList = {};
        if(fileList.length){
            tempList = {
                fileId:fileList[0].response.fileId,
                fileName:fileList[0].response.fileName,
                fileFormat:fileList[0].response.extName,
            }
        }else{
            tempList = {
                fileId:null,
                fileName:null,
                fileFormat:null,
            }
        }
        params = {
            ...params,
            ...tempList
        }
        dispatch({
            type: 'productMessage/addproduct',
            payload: params,
            callback: (res) => {
                if(res){
                    this.querylist();
                    if(res.state == 0){
                        Notification['success']({
                            message: res.msg,
                            duration:2
                        });
                    }else{
                        Notification['error']({
                            message: res.msg,
                            duration:2
                        });
                    }
                }
            } 
        })
    }

    // 点击批量删除
    handleDeleteCus = (param=[]) => {
        const {dispatch } = this.props;
        let ids = [];
        param.map( item => {
            ids.push(item.id);
        })

        ids = ids.toString();

        if(!ids){
            Message.warning("请选择需要删除的行");
            return false;
        }

        dispatch({
            type: 'productMessage/deleteproduct',
            payload:{
                ids
            }
        }).then( ()=>{
            // 刷新数据
            this.querylist();
            const { productMessage } = this.props;
            if(productMessage.deleteProduct.state == 0){
                Notification['success']({
                    message: productMessage.deleteProduct.msg,
                    duration:2
                });
            }else{
                Notification['error']({
                    message: productMessage.deleteProduct.msg,
                    duration:2
                });
            }
        })
  
    }

    // 点击客户信息导出
    importCustomer = (param=[]) => {
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
        form.action = `${httpHost}/scm/commodityInfo/expertExcel`;
        form.submit();
        document.body.removeChild(form);
        /*if(!this.state.searchlist){
            Message.warning('请添加搜索条件');
            return false;
        }
        const {dispatch} = this.props;
        dispatch({
            type: 'productMessage/importproduct',
            payload:{...this.state.searchlist}
        }).then(()=>{
            const { productMessage } = this.props;
            if(productMessage.importProduct.state == 0){
                Notification['success']({
                    message: productMessage.importProduct.msg,
                    duration:2
                });
            }else{
                Notification['error']({
                    message: productMessage.importProduct.msg,
                    duration:2
                });
            }
        })*/
    }

    setFileList = (fileList) => {
        this.setState({
            fileList
        })
    }

    // 重置搜索条件
    handleResetState = () => {
        this.setState({
            searchlist:null
        })
    }

    // 点击取消预览
    handleImgCancel = () => this.setState({ previewVisible: false })

    // 点击预览图片
    handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
    }

    // 上传商品图片
    handleImgChange = ({fileList}) => {
        this.setState({
            fileList ,
            changeStatus:!this.state.changeStatus
        })
    }

    // 刷新table数据
    reloadTable =  () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productMessage/productMessageList',
            payload: {}
        })
    }

    render() {
        const {
            productMessage,
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
                    <ProductSearch
                        onRef={this.onRef}
                        querylist={this.querylist}
                        iduClass={iduClass} 
                        handleResetState={this.handleResetState}
                        />
                    <ProductTable
                        current={this.state.current}
                        loading={loading}
                        data={productMessage}
                        handleModalVisible={this.handleModalVisible}
                        onDownload={this.onDownload}
                        onSwitch={this.onSwitch}
                        onChange={this.handleStandardTableChange.bind(this)}
                        changingStatus={changingStatus}
                        showModal={this.showModal}
                        handleEdit={this.handleEdit}
                        handleDeleteCus={this.handleDeleteCus}
                        importCustomer={this.importCustomer}
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
                    <ProductModal 
                        data={productMessage} 
                        modalType={modalType}
                        onCancel={this.handleCancel}
                        addProduct={this.addProduct}
                        editSaveProduct={this.editSaveProduct}
                        fileList={this.state.fileList}
                        setFileList={this.setFileList}
                        previewVisible={this.state.previewVisible}
                        fileList={this.state.fileList}
                        previewImage={this.state.previewImage}
                        handleImgChange={this.handleImgChange}
                        handlePreview={this.handlePreview}
                        handleImgCancel={this.handleImgCancel}
                        changeStatus={this.state.changeStatus}
                    />
                </Modal>
            </div>
        );
    }
}
export default ProductList