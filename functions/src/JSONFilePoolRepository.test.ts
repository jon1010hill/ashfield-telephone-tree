import * as chai from 'chai'
import {PoolData, Api} from './types'
import {JSONFilePoolRepository} from './JSONFilePoolRepository'
import {getTestPool, getApi} from './Mother.test'

import 'mocha'
import {Pool} from './Pool'

describe('PoolRepository tests', () => {
  it('test findByNumberDialled returns expected pool', () => {
    const api: Api = getApi()
    const samplePoolData: PoolData[] = [
      getTestPool('Project A', '01234'),
      getTestPool('Project B', '56789')
    ]
    const repo = new JSONFilePoolRepository({api, pools: samplePoolData})
    chai
      .expect(() => repo.findByNumberDialled('foobar'))
      .to.throw('Pool does not exist')

    const pool: Pool = repo.findByNumberDialled('01234')
    chai.expect(pool).to.not.be.undefined
    chai.expect(pool.getCommunityName()).to.equal('Project A')
    chai.expect(pool.getInboudNumber()).to.equal('01234')
  })
})
