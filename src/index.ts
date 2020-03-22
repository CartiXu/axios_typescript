import axios from './axios'

export * from './types' // 暴露出所有

export default axios // 被引用时候直接给出core/Axios里的核心方法get  post等
