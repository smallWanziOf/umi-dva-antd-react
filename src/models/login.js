import { loginCode, loginByTel, addUser , getPhoneCode} from '@/services/api';

export default {
    namespace: 'login',
    state: {
        data: {

        }
    },
    effects: {
        *loginCode({ payload }, { call, put }) {
            const response = yield call(loginCode, payload);
            return response;
        },
        *login({ payload }, { call, put }) {
            const response = yield call(loginByTel, payload);
            return response;
            // if (response.state === 0) { response.currentAuthority = 'user' }
            // yield put({
            //     type: 'changeLoginStatus',
            //     payload: response,
            // });
            if (response.state === 1) {
                message.error(response.msg);
                return
            }
            if (response.state === 0) {
                const storage = window.localStorage;
                storage.name = response.resultInfo.name;
                storage.tel = response.resultInfo.tel;
                storage.userId = response.resultInfo.userId;
            }
        },
        *addUser({ payload }, { call, put }) {
            const response = yield call(addUser, payload);
            return response;
        },
        *getPhonecode({payload}, {call, put}){
            const response = yield call(getPhoneCode, payload);
            return response;
        }
    },

    reducers: {
        responseData(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        }
    },
};
