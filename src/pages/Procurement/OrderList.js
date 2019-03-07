import router from 'umi/router';
import { Button, Message, Card, Spin , Notification , Form} from 'antd';
import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
import OrderListSearch from '@/components/Procurement/OrderListSearch';
import OrderListTable from '@/components/Procurement/OrderListTable';
import { OrderStatusList , httpHost } from '../../services/setting';

Message.config({
    top: 200
})

@connect(({ procurementMessage, loading }) => ({
    procurementMessage,
    loading: loading.models.procurementMessage,
    //tableLoading: loading.effects['procurementMessage/contractlist'],
}))
class OrderList extends PureComponent {
    state = {
        modalVisible: false,
        stepFormValues: {},
        pagination: {},
        searchlist: null,
        valueType: '',
        iduClass: {},
        rderStatusOtion:[],
        current:1,
    };

    // 搜索条件重置
    handleResetState = () => {
        this.setState({
            searchlist:null
        })
    }

    //初始化获取
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'procurementMessage/getProcureOrderlist',
            payload: {
                pageNum:1,
                pageSize:10
            }
        })
        fetch(`${OrderStatusList}/JSBSCMOrderStatus`).then(function (response) {
            return response.json();
        }).then((data) => {
            let { resultInfo } = data;
            let temp = [];
            resultInfo.map(item => {
                if(item.codeKey!='1001'){
                    temp.push({
                        value:item.codeKey,
                        lable:item.codeValue
                    })
                }
            })
            this.setState({
                rderStatusOtion:temp
            })
        }).catch(function (e) {
            // console.log("Oops, error");
        });
    }

    // 查询
    querylist = (res=this.state.searchlist) => {
        const { dispatch } = this.props;
        const params = {
            ...res,
        }
        this.setState({
            searchlist: res,
            current:1
        });
        dispatch({
            type: 'procurementMessage/getProcureOrderlist',
            payload: {
                ...params,
                pageNum:1,
                pageSize:10
            },
        });
    }

    // 表单提交
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
            type: 'procurementMessage/getProcureOrderlist',
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

    // 弹框关闭
    handleCancels = () => {
        this.setState({
            modalVisible: false,
            stepFormValues: {}
        });
    };


    // 确认付款
    handlePay = (record) =>{
        const { dispatch } = this.props;
        router.push('/procurement/confirmpayorder?id='+record.orderId)
    }

    // 确认入库
    handleWareHose = (record) =>{
        const { dispatch } = this.props;
        router.push('/procurement/warehouseorder?id='+record.orderId)
    }

    // 导出采购信息
    procuremeExpertExcel = (param) => {
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
        form.action = `${httpHost}/scm/purchaseOrderInfo/expertExcel`;
        form.submit();
        document.body.removeChild(form);

        /*if(!this.state.searchlist){
            Message.warning('请添加搜索条件');
            return false;
        }
        const {dispatch} = this.props;
        dispatch({
            type: 'procurementMessage/procuremeExpertexcel',
            payload:{...this.state.searchlist}
        }).then(()=>{

            /*const { procurementMessage } = this.props;
            if(procurementMessage.procuremeExpertExcel.state == 0){
                Notification['success']({
                    message: procurementMessage.procuremeExpertExcel.msg,
                    duration:2
                });
                //router.push('/procurement/orderList')
            }else{
                Notification['error']({
                    message: procurementMessage.procuremeExpertExcel.msg,
                    duration:2
                });
            }
        })*/
    } 

    // 点击批量删除
    batchDelete = (param=[]) => {
        const {dispatch } = this.props;
        let orderIds = [];
        param.map( item => {
            orderIds.push(item.orderId);
        })

        orderIds = orderIds.toString();

        if(!orderIds){
            Message.warning('请选择需要删除的行');
            return false;
        }

        dispatch({
            type: 'procurementMessage/batchdelete',
            payload:{
                orderIds
            }
        }).then( ()=>{
            // 刷新数据
            this.querylist();
            const { procurementMessage } = this.props;
            if(procurementMessage.batchDelete.state == 0){
                Notification['success']({
                    message: procurementMessage.batchDelete.msg,
                    duration:2
                });
            }else{
                Notification['error']({
                    message: procurementMessage.batchDelete.msg,
                    duration:2
                });
            }
        })
  
    }

    render() {
        const {
            procurementMessage,
            loading,
            tableLoading,
        } = this.props;
        const { iduClass, changingStatus } = this.state;
        // const datass = { "state": 0, "msg": "", "resultInfo": { "pagination": { "current": 1, "pageSize": 10, "total": 5 }, "list": [{ "id": 22, "templeName": "测试00133344", "tradeType": 1002, "renovateTime": 20181228173338606, "lookNum": 0, "downloadNum": 8, "start": 1001, "fileId": "a531edeabdd4e438abf3d06832770160", "fileName": "八戒财税.docx", "fileSize": 3669489, "format": "docx", "del": null, "url": "http://fileserver.jieshui8.org/file/download/a531edeabdd4e438abf3d06832770160/1546395290346", "tradeTypeStr": "劳动人事", "renovateTimeStr": "2018-12-28 17:33:38" }, { "id": 23, "templeName": "测试", "tradeType": 1005, "renovateTime": 20181228165614111, "lookNum": 0, "downloadNum": 0, "start": 1002, "fileId": "78128d639f62ef0898bab8b5e4a652f4", "fileName": "Group2.png", "fileSize": 10213, "format": "png", "del": null, "url": "http://fileserver.jieshui8.org/file/download/78128d639f62ef0898bab8b5e4a652f4/1546395290348", "tradeTypeStr": "抵押担保", "renovateTimeStr": "2018-12-28 16:56:14" }, { "id": 24, "templeName": "测试3", "tradeType": 1003, "renovateTime": 20181228165615863, "lookNum": 0, "downloadNum": 1, "start": 1002, "fileId": "9c92edf6d74339d5fd3d0f20f244077d", "fileName": "Group3.png", "fileSize": 8575, "format": "png", "del": null, "url": "http://fileserver.jieshui8.org/file/download/9c92edf6d74339d5fd3d0f20f244077d/1546395290349", "tradeTypeStr": "知识产权", "renovateTimeStr": "2018-12-28 16:56:15" }, { "id": 25, "templeName": "测试5", "tradeType": 1002, "renovateTime": 20181228165617245, "lookNum": 0, "downloadNum": 0, "start": 1002, "fileId": null, "fileName": null, "fileSize": null, "format": null, "del": null, "url": null, "tradeTypeStr": "劳动人事", "renovateTimeStr": "2018-12-28 16:56:17" }, { "id": 26, "templeName": "1", "tradeType": 1007, "renovateTime": 20181228165619777, "lookNum": 0, "downloadNum": 0, "start": 1001, "fileId": null, "fileName": null, "fileSize": null, "format": null, "del": null, "url": null, "tradeTypeStr": "工程-建筑-技术", "renovateTimeStr": "2018-12-28 16:56:19" }] } }
        // const datas = datass.resultInfo
        // console.log(loading && !tableLoading)
        return (
            <div>
                <Card bordered={false} className={'mainBox'}>
                    <OrderListSearch
                        onRef={this.onRef}
                        querylist={this.querylist}
                        rderStatusOtion={this.state.rderStatusOtion} 
                        handleResetState={this.handleResetState}
                        />
                    <OrderListTable
                        querylist={this.querylist}
                        loading={loading}
                        data={procurementMessage}
                        current={this.state.current}
                        handleModalVisible={this.handleModalVisible}
                        onChange={this.handleStandardTableChange.bind(this)}
                        changingStatus={changingStatus}
                        handlePay={this.handlePay}
                        handleWareHose={this.handleWareHose}
                        procuremeExpertExcel={this.procuremeExpertExcel.bind(this)}
                        batchDelete={this.batchDelete}
                    />
                </Card>
                {/* <Spin spinning={loading && !tableLoading && !changingStatus} /> */}
            </div>
        );
    }
}
export default OrderList