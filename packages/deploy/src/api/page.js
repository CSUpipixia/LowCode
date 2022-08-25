import { request } from '@/utils/request'

export const getHomePage = () => {
  return request({
    url: `/page/home/get`,
    method: 'GET'
  })
}

export const getPageByPath = (path) => {
  return request({
    url: `/page/path/${path}`,
    method: 'GET'
  })
}
