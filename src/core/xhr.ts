import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'

import { parseHearders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  // 返回一个Promise对象
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config // data默认是null method默认get

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url!, true) // 异步：true

    request.onreadystatechange = function handleLoad() {
      // 请求状态为4说明是可以请求的
      /*
        存有 XMLHttpRequest 的状态。从 0 到 4 发生变化。
        0: 请求未初始化
        1: 服务器连接已建立
        2: 请求已接收
        3: 请求处理中
        4: 请求已完成，且响应已就绪
      */
      if (request.readyState !== 4) {
        return
      }

      /*
        只读属性 XMLHttpRequest.status 返回了XMLHttpRequest 响应中的数字状态码。
        status 的值是一个无符号短整型。在请求完成前，status的值为0。
        值得注意的是，如果 XMLHttpRequest 出错，浏览器返回的 status 也为0。
      */
      if (request.status === 0) {
        return
      }

      const responseHeaders = parseHearders(request.getAllResponseHeaders())
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }

    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }

    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })
    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
