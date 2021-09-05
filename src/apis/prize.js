import request from '@/utils/request';

const context = '/prizes';

export const addPrize = (data) => {
  return request({
    url: `${context}/add`,
    method: 'post',
    data
  })
};

export const getPrizes = (params) => {
  return request({
    url: `${context}`,
    method: 'get',
    params,
  });
};

export const getPrizePool = (params) => {
  return request({
    url: `${context}/get_prize_pool`,
    method: 'get',
    params
  })
}

export const setPrizePool = (data) => {
  return request({
    url: `${context}/set_prize_pool`,
    method: 'put',
    data
  })
}

export const deletePrize = (data) => {
  return request({
    url: `${context}/${data.oid}`,
    method: 'delete'
  })
}