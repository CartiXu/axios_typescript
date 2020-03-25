import {
  AxiosPromise,
  AxiosRequestConfig,
  Method,
  AxiosResponse,
  ResolvedFn,
  RejectedFn
} from '../types'
import dispatchRequest from './dispatchRequest'
import IntercepterManager from './interceptorManager'

interface Interceptors {
  request: IntercepterManager<AxiosRequestConfig>
  response: IntercepterManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosRequestConfig)
  rejected?: RejectedFn
}

export default class Axios {
  defaults: AxiosRequestConfig
  interceptors: Interceptors

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new IntercepterManager<AxiosRequestConfig>(),
      response: new IntercepterManager<AxiosResponse>()
    }
  }

  // 请求 调用dispatchRequest
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      // 此时url为config
      config = url
    }

    // 链式调用 定义一个Promise chain
    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    }) // 先添加先执行

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    }) // 后添加后执行

    let promise = Promise.resolve(config)

    // 链式调用
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        // 用Object.assign()方法传入属性到request方法
        method,
        url,
        data
      })
    )
  }
}
