import request from '@/utils/request';

const context = `/award_records`;

export const getAwardRecord = (params) => {
  return request({
    url: `${context}`,
    method: 'get',
    params
  })
}