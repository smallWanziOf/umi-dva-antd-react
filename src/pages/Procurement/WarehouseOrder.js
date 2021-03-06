import router from 'umi/router';
import { Button, Steps , Card, Spin , Notification } from 'antd';
import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
import Warehouse from '@/components/Procurement/Warehouse';
import { PaatDataContractTemple } from '../../services/setting';
import styles from './OrderDetails.less';

const Step = Steps.Step;

@connect(({ procurementMessage, loading }) => ({
    procurementMessage,
    loading: loading.models.procurementMessage,
}))
class WarehouseOrder extends React.PureComponent {
    state = {
        modalVisible: false,
        stepFormValues: {},
        pagination: {},
        searchlist: {},
        valueType: '',
        orderId: null,
    };

    //初始化获取
    componentDidMount() {
        let query = window.location.search;
        const id = parseInt(query.slice(query.indexOf('=')+1));
        const { dispatch } = this.props;
        this.setState({
            orderId:id
        })
        dispatch({
            type: 'procurementMessage/procureOrderEditshow',
            payload: {
                orderId:id
            }
        })
    }

    // 点击提交去入库
    handleSubmit = (inboundTiStr,signer) =>{
        const { dispatch } = this.props;
        dispatch({
            type: 'procurementMessage/procuremetWarehouse',
            payload: {
                inboundTiStr,signer,orderId:this.state.orderId
            }
        }).then(()=>{
            const { procurementMessage } = this.props;
            if(procurementMessage.procuremetWareHouse.state == 0){
                Notification['success']({
                    message: procurementMessage.procuremetWareHouse.msg,
                    duration:2
                });
                router.push('/procurement/orderList')
            }else{
                Notification['error']({
                    message: procurementMessage.procuremetWareHouse.msg,
                    duration:2
                });
            }
        })
    }

    render() {
        const {
            procurementMessage:{procureOrderEditShow},
            loading,
            tableLoading,
        } = this.props;
        const { changingStatus } = this.state;
        return (
            <div className={styles.orderDetails}>
                <h2 className={`wtBc ${styles.title}`}>基础详情页</h2>
                <Card bordered={false} className={`mainBox tang ${styles.process}`}><b>流程进度</b></Card>  
                <Card bordered={false} className={'mainBox'}>
                    <Warehouse data={procureOrderEditShow} handleSubmit={this.handleSubmit}/>
                </Card>
                <Spin spinning={loading && !tableLoading && !changingStatus} />
            </div>
        );
    }
}
export default WarehouseOrder