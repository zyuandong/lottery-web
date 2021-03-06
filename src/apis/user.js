import request from '@/utils/request';

const context = '/users';

export const register = (data) => {
  return request({
    url: `${context}/register`,
    method: 'post',
    data,
  });
};

export const login = (params) => {
  return request({
    url: `${context}/login`,
    method: 'get',
    params,
  });
};

export const getUsers = (params) => {
  return request({
    url: `${context}`,
    method: 'get',
    params,
  });
};

export const getUser = (params) => {
  return request({
    url: `${context}/${params.oid}`,
    method: 'get',
  });
};

export const lottery = (data) => {
  return request({
    url: `${context}/lottery`,
    method: 'post',
    data,
  });
};

export const uploadAvatar = (data) => {
  const oid = data.get('oid')
  return request({
    url: `${context}/${oid}/avatar/upload`,
    method: 'post',
    data
  })
}

export const signIn = ({oid}) => {
  return request({
    url: `${context}/${oid}/sign_in`,
    method: 'post',
  })
}