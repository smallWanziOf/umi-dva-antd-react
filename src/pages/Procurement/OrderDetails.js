import router from 'umi/router';
import { Button, Steps , Card, Spin } from 'antd';
import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
import OrderListDetails from '@/components/Procurement/OrderListDetails';
import { PaatDataContractTemple } from '../../services/setting';
import styles from './OrderDetails.less';

const Step = Steps.Step;

@connect(({ procurementMessage, loading }) => ({
    procurementMessage,
    loading: loading.models.procurementMessage,
}))
class OrderDetails extends React.PureComponent {
    state = {
        modalVisible: false,
        stepFormValues: {},
        pagination: {},
        searchlist: {},
        valueType: '',
        iduClass: {},
        orderId:null
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



    render() {
        const {
            procurementMessage:{procureOrderEditShow},
            loading,
            tableLoading,
        } = this.props;
        const { iduClass, changingStatus } = this.state;
        return (
            <div className={styles.orderDetails}>
                <h2 className={`wtBc ${styles.title}`}>基础详情页</h2>
                <Card bordered={false} className={`mainBox tang ${styles.process}`}><b>流程进度</b></Card>  
                <Card bordered={false} className={'mainBox'}>
                    <OrderListDetails data={procureOrderEditShow}/>
                </Card>
                <Spin spinning={loading && !tableLoading && !changingStatus} />
            </div>
        );
    }
}
export default OrderDetails