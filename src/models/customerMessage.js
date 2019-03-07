import { getAddressList , getLogList, addCustomer  , customerMessageGoPage , editSaveCustomer , customerMessageTotal , customerEdit , importCustomer , deleteCustomer} from '@/services/api';
import {Message} from 'antd';

Message.config({
    top: 200
})

export default {
    namespace: 'customerMessage',

    state: {
        data: {},
        loglist: [],
        customerList:[],
        editSaveCustomer:null,
        editCustomer:[],
        importCustomer:[],
        deleteCustomer:[],
        addCustomer:[],
        getAddressList:[],
    },
    effects: {
        *getAddresslist({payload, callback},{call, put}){
            const response = yield call(getAddressList, payload);
            if(response.state == 0) {
                if(callback && typeof callback === 'function'){
                    callback(response);
                    yield put({
                        type: 'getAddressList',
                        payload:response.resultInfo||[]
                    })
                }
            }else{
                Message.error('请求出错')
            }
        },
        *contractadd({ payload, payloadlist }, { call, put }) {
            const response = yield call(contractAdd, payload);
            return response.state;
            // if (response.state === 0) {
            //     message.success(response.msg);
            //     const responselist = yield call(contractList, payloadlist);
            //     yield put({
            //         type: 'save',
            //         payload: responselist.resultInfo,
            //     });
            // }
        },
        *getLoglist({ payload }, { call, put }) {
            const response = yield call(getLogList, payload);
            yield put({
                type: 'savegetLoglist',
                payload: response.resultInfo || [],
            });
        },
        // *downloads({ payload, payloadlist }, { call, put }) {
        //     const response = yield call(downloads, payload);
        //     if (response.state === 0) {
        //         const responselist = yield call(contractList, payloadlist);
        //         yield put({
        //             type: 'save',
        //             payload: responselist.resultInfo ,
        //         });
        //     }
        // },
        *customerMessageList({ payload },{ call , put }){
            // 销售管理-客户信息查询
            const list = yield call(customerMessageGoPage, payload);
            const total = yield call(customerMessageTotal, payload);
            yield put({
                type: 'customerList',
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
                payload:response
            })
        },
        *deletecustomer({ payload }, { call , put }){
            const response = yield call(deleteCustomer, payload);
            yield put({
                type: 'deleteCustomer',
                payload:response
            })
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
        savegetLoglist(state, action) {
            return {
                ...state,
                loglist: action.payload || {},
            };
        },
        customerList(state, action){
            return {
                ...state,
                customerList: action.payload
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
        deleteCustomer(state, action){
            return {
                ...state,
                deleteCustomer:action.payload
            }
        },
        getAddressList(state, action){
            // let temp = action.payload;
            // temp.map( (item, key ) => {
            //     temp[key]['value'] = item['adcode'];
            //     temp[key]['label'] = item['name'];
            // })
            return {
                ...state,
                getAddressList: action.payload
            }
        }
    },
};

