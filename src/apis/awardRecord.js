import request from '@/utils/request';

const context = `/award_records`;

export const getAwardRecord = (params) => {
  return request({
    url: `${context}`,
    method: 'get',
    params
  })
}

export const getLatestAwardRecord = (params) => {
  return request({
    url: `${context}/latest`,
    method: 'get',
    params
  })
}

export const getUserAwardRecord = (params) => {
  return request({
    url: `${context}/users/${params.oid}`,
    method: 'get'
  })
}
