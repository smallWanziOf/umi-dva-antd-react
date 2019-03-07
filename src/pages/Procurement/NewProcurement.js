import router from 'umi/router';
import { Button, message, Card, Spin } from 'antd';
import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
import NewProcurementTable from '@/components/Procurement/NewProcurement';
import { PaatDataContractTemple } from '../../services/setting';

@connect(({ procurementMessage, loading }) => ({
    procurementMessage,
    loading: loading.models.procurementMessage,
}))
class NewProcurement extends PureComponent {
    state = {
        modalVisible: false,
        stepFormValues: {},
        pagination: {},
        searchlist: {},
        valueType: '',
        iduClass: {},
    };

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
                    <NewProcurementTable
                        loading={loading}
                        data={procurementMessage}
                        handleModalVisible={this.handleModalVisible}
                        onDownload={this.onDownload}
                        onSwitch={this.onSwitch}
                        changingStatus={changingStatus}
                    />
                </Card>
                {/* <Spin spinning={loading && !tableLoading && !changingStatus} /> */}
            </div>
        );
    }
}
export default NewProcurement