import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
  const { data = null, url, method = 'get' } = config // data默认是null method默认get

  const request = new XMLHttpRequest()

  request.open(method.toUpperCase(), url, true) // 异步：true

  request.send(data)
}
