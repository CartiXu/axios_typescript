import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from '../core/transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // 处理config属性
  processConfig(config)
  // 返回Promise对象 并给出返回对象res
  console.log(config)

  return xhr(config).then(res => {
    console.log(res)

    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.tansformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 对传入的url进行处理
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params) // 感叹号(非空断言操作符)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.tansformResponse)
  return res
}
