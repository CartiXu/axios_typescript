import { AxiosTransformer } from '../types'

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  // 链式调用单个处理函数 最后的data值即为经给多重处理后的值
  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data
}
