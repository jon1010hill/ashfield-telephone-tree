import {AppData} from './types'
import {Pool} from './Pool'

export class PoolRepository {
  private db: AppData[]

  constructor(appData: AppData[]) {
    this.db = JSON.parse(JSON.stringify(appData))
  }

  findByCaller(_number: string): Pool | undefined {
    const poolData: AppData[] = this.db.filter(
      data => data.pool.number === _number
    )
    if (poolData.length > 1) {
      throw new Error('Duplicate data error') // todo consider error handling strategy
    }
    if (poolData.length === 0) {
      return undefined
    }
    return new Pool(poolData[0].pool)
  }
}
