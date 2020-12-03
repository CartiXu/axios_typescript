import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { flattenHeaders, processHearders } from '../helpers/headers'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // 处理config属性
  processConfig(config)
  // 返回Promise对象 并给出返回对象res
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.headers = transformHeaders(config)
  config.data = tranformRequestData(config)
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 对传入的url进行处理
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params) // 感叹号(非空断言操作符)
}

// 对传入的数据进行处理
function tranformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

// 对请求头部进行处理
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config // 如果没有headers 也赋值一个空
  return processHearders(headers, data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}
