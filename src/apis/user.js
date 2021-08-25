import request from '@/utils/request'

const context = '/users'

export const register = (data) => {
  return request({
    url: `${context}/register`,
    method: 'post',
    data
  })
}

export const login = (params) => {
  return request({
    url: `${context}/login`,
    method: 'get',
    params
  })
}

