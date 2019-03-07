import { supplierMessageGoPage, supplierMessageTotal, editSaveSupplier, addSupplier,supplierEdit,importSupplier,deleteSupplier} from '@/services/api';
import {Message} from 'antd';

Message.config({
    top: 200
})

export default {
    namespace: 'supplierMessage',

    state: {
        data: {},
        loglist: [],
        supplierList:[],
        editSaveCustomer:null,
        editSupplier:[],
        importSupplier:[],
        deleteSupplier:[],
        addSupplier:[],
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
        *supplierMessageList({ payload },{ call , put }){
            // 销售管理-客户信息查询
            const list = yield call(supplierMessageGoPage, payload);
            const total = yield call(supplierMessageTotal, payload);
            yield put({
                type: 'supplierList',
                payload: {
                    list,
                    total,
                }
            })
        },
        *editSavesupplier({ payload }, { call, put}){
            // 销售管理-新建客户信息
            const response  = yield call(editSaveSupplier, payload);
            yield put({
                type: 'editSaveSupplier',
                payload: response
            })
        },
        *addsupplier({ payload }, { call, put}){
            // 销售管理-新建客户信息
            const response  = yield call(addSupplier, payload);
            yield put({
                type: 'addSupplier',
                payload: response
            })
        },
        *supplieredit({ payload , callback }, { call, put }){
            // 销售管理-编辑客户信息
            const response = yield call(supplierEdit, payload);
            if(response.state == 0) {
                if(callback && typeof callback === 'function'){
                    callback(response);
                    yield put({
                        type: 'editSupplier',
                        payload:response.resultInfo || []
                    })
                }
            }else{
                Message.error('请求出错')
            }
        },
        *importsupplier({ payload }, { call , put }){
            const response = yield call(importSupplier, payload);
            yield put({
                type: 'importSupplier',
                payload:response
            })
        },
        *deletesupplier({ payload }, { call , put }){
            const response = yield call(deleteSupplier, payload);
            yield put({
                type: 'deleteSupplier',
                payload:response
            })
        },
    },

    reducers: {
        supplierList(state, action){
            return {
                ...state,
                supplierList: action.payload
            }
        },
        editSaveSupplier(state, action){
            return {
                ...state,
                editSaveSupplier:action.payload
            }
        },
        addSupplier(state, action){
            return {
                ...state,
                addSupplier:action.payload
            }
        },
        editSupplier(state, action){
            return {
                ...state,
                editSupplier:action.payload
            }
        },
        importSupplier(state, action){
            return {
                ...state,
                importSupplier:action.payload
            }
        },
        deleteSupplier(state, action){
            return {
                ...state,
                deleteSupplier:action.payload
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

