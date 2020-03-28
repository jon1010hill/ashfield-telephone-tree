import {FirestorePoolRepository} from './FirestorePoolRepository'
import {PoolBuilder, Pool} from './Pool'
import * as db from './data/data.json'
import {PoolData} from './types'

export class PoolDataLoader {
  async loadFromJson(repo: FirestorePoolRepository) {
    const pools: PoolData[] = db.pools
    for await (const pool of pools) {
      try {
        const persisted = await repo.findByNumberCalled(pool.number)
        if (persisted) {
          continue
        }
      } catch (e) {
        const p: Pool = new Pool(pool)
        await repo.create(p.getData())
      }
    }
  }
  async loadSample(repo: FirestorePoolRepository) {
    const pool: Pool = new PoolBuilder()
      .withCommunityName('Sample')
      .withMaxCallDuration(600)
      .withRingTimeout(5)
      .withNumber('+447766111111')
      .withMessages({
        intro:
          'Hello. You have reached {NAME} community line. We will try to connect you to {PERSON} on {STREET}',
        next: 'We are now trying to connect you to {PERSON} on {STREET}',
        voice: 'woman',
        screen:
          'This is the {NAME} community line, we are about to connect you to a caller. If you reject this call it will pass to someone else'
      })
      .withPeople([
        {
          name: 'Jon',
          number: '+447766222222',
          address: 'Some Road'
        }
      ])
      .build()

    try {
      const persistedPool = await repo.findByNumberCalled(
        pool.getInboundNumber()
      )
      return persistedPool
    } catch (e) {
      return await repo.create(pool.getData())
    }
  }
}
