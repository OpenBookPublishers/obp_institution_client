import { getInstitutions, getContacts, postInstitution, deleteInstitution} from '../services/api';
import { message } from 'antd';

export default {
  namespace: 'institution',

  state: {
    institution: [],
  },

  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('Submitted successfully');
    },
    *submitAdvancedForm({ payload }, { call }) {
      const response =  yield call(postInstitution, payload);
      console.log(response);
      if (response !== undefined && response.status === 'ok'){
        message.success('Submitted successfully');
      }
      return;
    },
    *deleteInstitutionFromList({ payload }, { call , put }) {
      yield call(deleteInstitution,payload);
      yield put({
        type: 'refreshAfterDelete',
        payload: payload,
      });
      message.success('Deleted successfully');
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(getInstitutions, payload);
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
        institution: action.payload,
      };
    },
    refreshAfterDelete(state, action){
      return {
        ...state,
        institution: state.institution.filter(e => e.institution_uuid !== action.payload),
      }
    },
  },
};
