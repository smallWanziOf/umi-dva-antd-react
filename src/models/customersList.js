import { updateRule, getInfo, saveInfo, removeInfo, getCity } from '@/services/api';

export default {
    namespace: 'customersList',

    state: {
        data: {
            list: [],
            pagination: {}
        },
        citylist: []
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(getInfo, payload);
            yield put({
                type: 'save',
                payload: response.resultInfo,
            });
        },
        *add({ payload }, { call, put }) {
            const response = yield call(saveInfo, payload);
            // if (response.state === 0) {
            //     message.success(response.msg);
            //     const responselist = yield call(getInfo, payloadlist);
            //     yield put({
            //         type: 'save',
            //         payload: responselist,
            //     });
            // }
            return response.state;
        },
        *getCity({ payload }, { call, put }) {
            const response = yield call(getCity, payload);
            let res = {}
            if (response.state === 0) {
                const resyield = () => {
                    res = response.resultInfo.map(function (item, index, input) {
                        const districts = item.districts.map(function (item, index, input) {
                            return {
                                adcode: item.adcode,
                                center: item.center,
                                citycode: item.citycode,
                                level: item.level,
                                name: item.name,
                            }
                        })
                        return {
                            adcode: item.adcode,
                            center: item.center,
                            citycode: item.citycode,
                            level: item.level,
                            name: item.name,
                            districts: districts,
                        }
                    })
                    return res
                }
                yield resyield()
                yield put({
                    type: 'city',
                    payload: res,
                });
            }
        },
        *remove({ payload, callback }, { call, put }) {
            const response = yield call(removeInfo, payload);
            if (callback) callback();
        },
        *update({ payload, callback }, { call, put }) {
            const response = yield call(updateRule, payload);
            if (callback) callback();
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: { list: action.payload.list, pagination: action.payload.pagination },
            };
        },
        city(state, action) {
            return {
                ...state,
                citylist: action.payload,
            };
        },
    },
};
