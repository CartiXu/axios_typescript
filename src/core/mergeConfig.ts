import { AxiosRequestConfig } from '../types'
import { isPlainObjet } from '../helpers/util'

/*
    合并方法的整体思路就是对 config1 和 config2 中的属性遍历，
    执行 mergeField 方法做合并，这里 config1 代表默认配置，config2 代表自定义配置。
*/

const strats = Object.create(null)

// 默认合并策略
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// function deepMergeStrat(val1: any, val2: any): any  {
//     if (isPlainObjet(val2)) {
//         return deepMerge()
//     }
// }

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)

  for (const key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    // 选择merge函数
    const strat = strats[key] || defaultStrat
    // 将merge后的值传入config
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
