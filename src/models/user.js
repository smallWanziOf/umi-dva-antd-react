import { currentUser, loginOut } from '@/services/api';

export default {
    namespace: 'user',
    state: {
        data: {
            currentUser: {},
        }
    },
    effects: {
        *currentUser({ payload }, { call, put }) {
            const response = yield call(currentUser, payload);
            yield put({
                type: 'responseData',
                payload: response,
            });
        },
        *loginOut({ payload }, { call, put }) {
            const response = yield call(loginOut, payload);
            return response.state;
        },
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
