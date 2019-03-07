import {  productMessageGoPage  , productMessageTotal , editSaveProduct , addProduct , productEdit , importProduct , deleteProduct , getSupplierInfoList} from '@/services/api';
import { Message} from 'antd';

Message.config({
    top: 200
})

export default {
    namespace: 'productMessage',

    state: {
        productList:[],
        editSaveProduct:null,
        editProduct:[],
        importProduct:[],
        deleteCustomer:[],
        addCustomer:[],
        supplierList:[],
        deleteProduct:[]
    },
    effects: {
        *productMessageList({ payload },{ call , put }){
            // 销售管理-客户信息查询
            const list = yield call(productMessageGoPage, payload);
            const total = yield call(productMessageTotal, payload);
            yield put({
                type: 'productList',
                payload: {
                    list,
                    total,
                }
            })
        },
        *editSaveproduct({ payload , callback }, { call, put}){
            // 销售管理-新建客户信息
            const response  = yield call(editSaveProduct, payload);
            if(response.state == 0){
                if(callback && typeof callback === 'function'){
                    callback(response);
                }
            }else{
                Message.error('请求出错')
            }
        },
        *addproduct({ payload , callback }, { call, put}){
            // 销售管理-新建客户信息
            const response  = yield call(addProduct, payload);
            if(response.state == 0) {
                if(callback && typeof callback === 'function'){
                    callback(response);
                }
            }else{
                Message.error('请求出错')
            }
        },
        *productedit({ payload , callback }, { call, put }){
            // 销售管理-编辑客户信息
            const response = yield call(productEdit, payload);
            if(response.state == 0) {
                if(callback && typeof callback === 'function'){
                    callback(response);
                    yield put({
                        type: 'editProduct',
                        payload:response.resultInfo || []
                    })
                }
            }else{
                Message.error('请求出错')
            }
            /*
            })**/
        },
        *importproduct({ payload }, { call , put }){
            const response = yield call(importProduct, payload);
            yield put({
                type: 'importProduct',
                payload:response
            })
        },
        *deleteproduct({ payload }, { call , put }){
            const response = yield call(deleteProduct, payload);
            yield put({
                type: 'deleteProduct',
                payload:response
            })
        },
        *getSupplierInfolist({ payload }, { call, put }){
            const response = yield call(getSupplierInfoList, payload);
            yield put({
                type: 'supplierList',
                payload: response.resultInfo || []
            })
        }
    },

    reducers: {
        productList(state, action){
            return {
                ...state,
                productList: action.payload
            }
        },
        editSaveCustomer(state, action){
            return {
                ...state,
                editSaveProduct:action.payload
            }
        },
        addCustomer(state, action){
            return {
                ...state,
                addCustomer:action.payload
            }
        },
        editProduct(state, action){
            return {
                ...state,
                editProduct:action.payload
            }
        },
        importProduct(state, action){
            return {
                ...state,
                importProduct:action.payload
            }
        },
        deleteProduct(state, action){
            return {
                ...state,
                deleteProduct:action.payload
            }
        },
        supplierList(state, action){
            return {
                ...state,
                supplierList: action.payload
            }
        }
    },
};