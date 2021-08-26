import request from '@/utils/request';

const context = '/prizes';

export const addPrize = () => {};

export const getPrizes = (params) => {
  return request({
    url: `${context}`,
    method: 'get',
    params,
  });
};

export const getPrizePools = (params) => {
  return request({
    url: `${context}/prize_pools`,
    method: 'get',
    params
  })
}