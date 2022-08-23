import { request } from '@/utils/request'

export const queryPageList = () => {
  return request({
    url: '/page/query',
    method: 'GET'
  })
}

export const createPage = (data) => {
  return request({
    url: '/page/create',
    method: 'POST',
    data
  })
}

export const getPage = (_id) => {
  return request({
    url: `/page/${_id}`,
    method: 'GET'
  })
}

export const setHomePage = (_id) => {
  return request({
    url: `/page/${_id}/setHomePage`,
    method: 'POST'
  })
}

export const savePageData = (_id, pageData) => {
  return request({
    url: `/page/${_id}/save`,
    method: 'POST',
    data: {
      pageData
    }
  })
}

export const deletePage = (_id) => {
  return request({
    url: `/page/${_id}/delete`,
    method: 'POST'
  })
}