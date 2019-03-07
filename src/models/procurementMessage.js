import { getSupplierInfoList ,
        addPlanOrder ,
        planOrderSubmit ,
        addPlanProductListTotal ,
        addPlanProductList ,
        planOrderEditDeleteAll ,
        planOrderEditDelete ,
        planOrderEditShow ,
        planOrderEditShowTotal ,
        changeOrderStatus,
        addCustomer  , 
        procureMessageGoPage , 
        editSaveCustomer , 
        procureMessageTotal , 
        customerEdit , 
        importCustomer , 
        batchDelete,
        procureOrderListTotal,
        procureOrderList,
        procureOrderEditShow,
        procuremetPay,
        procuremetWareHouse,
        procuremeExpertExcel,
        } from '@/services/api';
import {Message} from 'antd';

Message.config({
    top: 200
})

export default {
    namespace: 'procurementMessage',

    state: {
        procureList:[],
        editSaveCustomer:null,
        editCustomer:[],
        importCustomer:[],
        deleteCustomer:[],
        addCustomer:[],
        supplierList:[],
        changeOrderStatus:[],
        planOrderEditList:[],
        editId:null,
        planOrderEditDeleteAll:[],
        planOrderSubmit: [],
        addPlanProductList:{},
        addPlanOrder:[],
        getProcureOrderList:[],
        procureOrderEditShow:[],
        procuremetPay:[],
        procuremetWareHouse:[],
        procuremeExpertExcel:[],
    },
    effects: {
        *procuremeExpertexcel({payload}, {call, put}){
            const response = yield call(procuremeExpertExcel, payload);
            yield put({
                type: 'procuremeExpertExcel',
                payload: response
            })
        },
        *procuremetWarehouse({payload}, {call, put}){
            const response = yield call(procuremetWareHouse, payload);
            yield put({
                type: 'procuremetWareHouse',
                payload: response
            })
        },
        *procuremetpay({payload}, {call, put}){
            const response = yield call(procuremetPay, payload);
            yield put({
                type: 'procuremetPay',
                payload: response
            })
        },
        *procureOrderEditshow({payload}, {call, put}){
            const response = yield call(procureOrderEditShow, payload);
            yield put({
                type: 'procureOrderEditShow',
                payload: response
            })
        },
        *getProcureOrderlist({payload}, {call, put}){
            const list = yield call(procureOrderList, payload);
            const total = yield call(procureOrderListTotal, payload);
            yield put({
                type:'getProcureOrderList',
                payload:{
                    list,
                    total
                }
            })
        },
        *addPlanorder({payload}, {call, put}){
            const response = yield call(addPlanOrder, payload);
            yield put({
                type: 'addPlanOrder',
                payload: response
            })
        },
        *addPlanProductlist({payload, callback}, {call, put}){
            const modalList = yield call(addPlanProductList, payload);
            const modalTotal = yield call(addPlanProductListTotal, payload);
            //if(re)
            yield put({
                type: 'addPlanProductList',
                payload: {
                    modalList,
                    modalTotal
                }
            })
        },
        *planOrdersubmit({payload},{call, put}){
            const response = yield call(planOrderSubmit, payload);
            yield put({
                type: 'planOrderSubmit',
                payload: response 
            })
        },
        *planOrderEditDeleteall({payload}, {call, put}){
            const response = yield call(planOrderEditDeleteAll, payload);
            yield put({
                type: 'planOrderEditDeleteAll',
                payload:response
            })
        },
        *planOrderEditdelete({payload},{call, put}){
            const response = yield call(planOrderEditDelete, payload);
            yield put({
                type: 'planOrderEditDelete',
                payload:response
            })
        },
        *planOrderEditId({payload, callback},{call, put}){
            if(callback && typeof callback === 'function'){
                yield put({
                    type: 'planOrderEditId',
                    payload: {
                        id:payload.orderId
                    }
                })
                callback(payload.orderId);
            }
        },
        *planOrderEditlist({payload, callback},{call, put}){
            const list = yield call(planOrderEditShow, payload);
            const total = yield call(planOrderEditShowTotal, payload);
            yield put({
                type: 'planOrderEditList',
                payload: {
                    list,
                    total
                }
            })
        },
        *changeOrderstatus({payload},{call, put}){
            const response = yield call(changeOrderStatus, payload);
            yield put({
                type: 'changeOrderStatus',
                payload:response||[]
            })
        },
        *getSupplierInfolist({ payload }, { call, put }){
            const response = yield call(getSupplierInfoList, payload);
            yield put({
                type: 'supplierList',
                payload: response.resultInfo || []
            })
        },
        *procureMessageList({ payload },{ call , put }){
            // 销售管理-客户信息查询
            const list = yield call(procureMessageGoPage, payload);
            const total = yield call(procureMessageTotal, payload);
            yield put({
                type: 'procureList',
                payload: {
                    list,
                    total,
                }
            })
        },
        *editSavecustomer({ payload }, { call, put}){
            // 销售管理-新建客户信息
            const response  = yield call(editSaveCustomer, payload);
            yield put({
                type: 'editSaveCustomer',
                payload: response
            })
        },
        *addcustomer({ payload }, { call, put}){
            // 销售管理-新建客户信息
            const response  = yield call(addCustomer, payload);
            yield put({
                type: 'addCustomer',
                payload: response
            })
        },
        *customeredit({ payload , callback }, { call, put }){
            // 销售管理-编辑客户信息
            const response = yield call(customerEdit, payload);
            if(response.state == 0) {
                if(callback && typeof callback === 'function'){
                    callback(response);
                    yield put({
                        type: 'editCustomer',
                        payload:response.resultInfo || []
                    })
                }
            }else{
                Message.error('请求出错')
            }
        },
        *importcustomer({ payload }, { call , put }){
            const response = yield call(importCustomer, payload);
            yield put({
                type: 'importCustomer',
                payload:response.resultInfo || []
            })
        },
        *batchdelete({ payload }, { call , put }){
            const response = yield call(batchDelete, payload);
            yield put({
                type: 'batchDelete',
                payload:response
            })
        },
    },

    reducers: {
        procuremeExpertExcel(state, action){
            return {
                ...state,
                procuremeExpertExcel:action.payload
            }
        },
        procuremetWareHouse(state, action){
            return {
                ...state,
                procuremetWareHouse:action.payload
            }
        },
        procuremetPay(state, action){
            return {
                ...state,
                procuremetPay:action.payload
            }
        },
        procureOrderEditShow(state, action){
            action.payload.resultInfo.list.push({})
            return {
                ...state,
                procureOrderEditShow:action.payload
            }
        },
        getProcureOrderList(state, action){
            return {
                ...state,
                getProcureOrderList:action.payload
            }
        },
        addPlanOrder(state, action){
            return {
                ...state,
                addPlanOrder:action.payload
            }
        },
        addPlanProductList(state, action){
            return {
                ...state,
                addPlanProductList:action.payload
            }
        },
        planOrderSubmit(state, action){
            return {
                ...state,
                planOrderSubmit:action.payload
            }
        },
        planOrderEditDeleteAll(state, action){
            return {
                ...state,
                planOrderEditDeleteAll:action.payload
            }
        },
        planOrderEditDelete(state, action){
            return {
                ...state,
                planOrderEditDelete:action.payload
            }
        },
        planOrderEditId(state, action){
            return {
                ...state,
                editId:action.payload
            }
        },
        planOrderEditList(state, action){
            return {
                ...state,
                planOrderEditList:action.payload
            }
        },
        changeOrderStatus(state, action){
            return {
                ...state,
                changeOrderStatus:action.payload
            }
        },
        procureList(state, action){
            return {
                ...state,
                procureList: action.payload
            }
        },
        editSaveCustomer(state, action){
            return {
                ...state,
                editSaveCustomer:action.payload
            }
        },
        addCustomer(state, action){
            return {
                ...state,
                addCustomer:action.payload
            }
        },
        editCustomer(state, action){
            return {
                ...state,
                editCustomer:action.payload
            }
        },
        importCustomer(state, action){
            return {
                ...state,
                importCustomer:action.payload
            }
        },
        batchDelete(state, action){
            return {
                ...state,
                batchDelete:action.payload
            }
        },
        supplierList(state, action){
            // let temp = action.payload;
            // temp.map( (item, key ) => {
            //     temp[key]['value'] = item['adcode'];
            //     temp[key]['label'] = item['name'];
            // })
            return {
                ...state,
                supplierList: action.payload
            }
        }
    },
};

