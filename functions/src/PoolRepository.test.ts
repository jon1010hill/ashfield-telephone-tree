import * as chai from 'chai'
import {AppData} from './types'
import {PoolRepository} from './PoolRepository'
import {getTestPool, getApi} from './Mother.test'

import 'mocha'
import {Pool} from './Pool'

describe('PoolRepository tests', () => {
  it('test findByCaller returns expected pool', () => {
    const sampleData: AppData[] = [
      {
        api: getApi(),
        pool: getTestPool('Project A', '01234')
      },
      {
        api: getApi(),
        pool: getTestPool('Project B', '56789')
      }
    ]
    const repo = new PoolRepository(sampleData)
    chai.expect(repo.findByCaller('foobar')).to.be.undefined

    const pool: Pool | undefined = repo.findByCaller('01234')
    chai.expect(pool).to.not.be.undefined
    chai.expect(pool!.getCommunityName()).to.equal('Project A')
    chai.expect(pool!.getCallerNumber()).to.equal('Project A')
  })
})
