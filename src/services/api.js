import { stringify } from 'qs';
import request from '../utils/request';

export async function getInstitutions(params) {
  return request(`${REACT_APP_API}/institutions`);
}

export async function getContacts(params) {
  if(params){
    return request(`${REACT_APP_API}/contacts?contact_uuid=${params}`);
  }else{
    return request(`${REACT_APP_API}/contacts`);
  }
}

export async function getCountries(params){
  return request(`${REACT_APP_API}/countries`);
}

export async function postInstitution(params){
  return request(`${REACT_APP_API}/institutions`,{method:'POST',body:params});
}

export async function deleteInstitution(params){
  return request(`${REACT_APP_API}/institutions?institution_uuid=${params}`,
                    {method:'DELETE',
                    });
}

export async function login(params) {
  return request(`${REACT_APP_API}/auth?email=${params['email']}&password=${params['password']}`, {
    method: 'POST'
  });
}

export async function getWorkTypes(params) {
  return request(`${REACT_APP_API}/work_types?sort=work_type&order=asc`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryNotices() {
  return request('/api/notices');
}
