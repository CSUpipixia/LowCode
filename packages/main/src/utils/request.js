import axios from 'axios'

export function createAxios(options = {}) {
  const defaultOptions = {
    baseURL: 'http://114.132.122.184:9000',
    timeout: 12000,
  }
  const service = axios.create({
    ...defaultOptions,
    ...options,
  })
  return service
}

export const request = createAxios()