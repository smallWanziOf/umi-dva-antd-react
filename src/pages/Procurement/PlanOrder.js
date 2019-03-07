import router from 'umi/router';
import { Button, message, Card, Spin , Notification} from 'antd';
import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
import ProcurementSearch from '@/components/Procurement/ProcurementSearch';
import ProcurementTable from '@/components/Procurement/ProcurementTable';
import { PaatDataContractTemple } from '../../services/setting';
import moment from 'moment';

message.config({
    top: 200
})

@connect(({ procurementMessage, loading }) => ({
    procurementMessage,
    loading: loading.models.procurementMessage,
    //tableLoading: loading.effects['procurementMessage/procureList'],
}))
class PlanOrder extends PureComponent {
    state = {
        modalVisible: false,
        stepFormValues: {},
        pagination: {},
        searchlist: {},
        valueType: '',
        iduClass: {},
        current:1,
    };

    //初始化获取
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'procurementMessage/procureMessageList',
            payload: {
                pageNum:1,
                pageSize:10
            },
        })
    }

    // 搜索查询
    querylist = (res=this.state.searchlist) => {
        const { dispatch } = this.props;
        if(res.prePurchaseTiStr){
            let m = moment(res.prePurchaseTiStr).format('YYYY-MM-DD');
            res['prePurchaseTiStr'] = m
        }
        const params = {
            ...res,
        }
        // if(this.state.pagination['currentPage']){
        //     let { pagination } = this.state;
        //     pagination['currentPage'] = 1;
        //     this.setState({
        //         pagination
        //     })
        // }
        this.setState({
            searchlist: res,
            current:1,
        });
        dispatch({
            type: 'procurementMessage/procureMessageList',
            payload: {
                ...params,
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
            type: 'procurementMessage/procureMessageList',
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

    // 弹框关闭
    handleCancels = () => {
        this.setState({
            modalVisible: false,
            stepFormValues: {}
        });
    };

    //下载
    onDownload = (record) => {
        const { dispatch } = this.props;
        const { searchlist, pagination } = this.state;
        const paramslist = {
            ...searchlist,
            ...pagination,
        };
        dispatch({
            type: 'contract/downloads',
            payload: record.id,
            payloadlist: paramslist,
        });
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
            message.warning("请选择需要删除的行");
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
                {/* <h2 className={'wtBc pl25 pb25'}>邮箱管理</h2> */}
                <Card bordered={false} className={'mainBox'}>
                    <ProcurementSearch
                        onRef={this.onRef}
                        querylist={this.querylist}
                        iduClass={iduClass} />
                    <ProcurementTable
                        querylist={this.querylist}
                        current={this.state.current}
                        loading={loading}
                        data={procurementMessage}
                        handleModalVisible={this.handleModalVisible}
                        onDownload={this.onDownload}
                        onSwitch={this.onSwitch}
                        onChange={this.handleStandardTableChange.bind(this)}
                        changingStatus={changingStatus}
                        batchDelete={this.batchDelete}
                    />
                </Card>
                <Spin spinning={false} />
            </div>
        );
    }
}
export default PlanOrder