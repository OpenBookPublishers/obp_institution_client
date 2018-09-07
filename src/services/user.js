import request from '../utils/request';
import { getName, getSurname, getToken, getAuthority } from '../utils/user';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return {
    name: getName(),
    surname: getSurname(),
    token: getToken(),
    authority: getAuthority(),
    notifyCount: 3,
  };
}
