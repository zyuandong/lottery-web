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
