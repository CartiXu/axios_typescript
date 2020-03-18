import { isDate, isPlainObjet } from './util'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any) {
  if (!params) {
    // 不传params就直接return url
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const val = params[key]
    if (val === null || typeof val === 'undefined') {
      return
    }
    let values = [] // 有可能是数组类型的 统一处理为数组
    if (Array.isArray(val)) {
      // 如果是数组
      values = val
      key += '[]'
    } else {
      values = [val] // 变为数组
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObjet(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&') // 拼接

  if (serializedParams) {
    const markIndex = url.indexOf('#') // 看url中是否有#hash符号
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 看是否有问号
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}
