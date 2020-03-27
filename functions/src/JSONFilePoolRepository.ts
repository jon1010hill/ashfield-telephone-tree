import {AppData, PoolData} from './types'
import {Pool} from './Pool'
import {IPoolRepository} from './IPoolRepository'

/**
 * A repository implementation that takes it's data from a JSON file.
 *
 * Static, simple, stopgap solution until a proper hosted database is in place.
 */
export class JSONFilePoolRepository implements IPoolRepository {
  private db: AppData

  constructor(appData: AppData) {
    this.db = JSON.parse(JSON.stringify(appData))
  }

  findByNumberCalled(numberCalled: string): Pool {
    const poolData: PoolData[] = this.db.pools.filter(
      pool => pool.number === numberCalled
    )
    if (poolData.length > 1) {
      throw new Error('Duplicate data error')
    }
    if (poolData.length === 0) {
      throw new Error('Pool does not exist')
    }
    return new Pool(poolData[0])
  }
}
