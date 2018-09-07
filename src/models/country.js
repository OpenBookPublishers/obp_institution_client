import { getCountries } from '../services/api';
import { message } from 'antd';

export default {
  namespace: 'country',

  state: {
    country: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getCountries, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data) ? response.data: [],
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        country: action.payload,
      };
    },
  },
};
