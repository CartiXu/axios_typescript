import { isPlainObjet } from './util'

export function transformRequest(data: any): any {
  if (isPlainObjet(data)) {
    return JSON.stringify(data)
  }
  return data
}
