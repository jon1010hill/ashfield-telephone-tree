import * as chai from 'chai'
import 'mocha'
import {PoolData} from './types'
import {getTestPool, getTestPoolWithDuplicateNumbers} from './Mother.test'
import {Pool, PoolBuilder} from './Pool'

const expect = chai.expect

describe('Pool tests', () => {
  beforeEach(() => {})
  afterEach(() => {})

  it('test getNumbers', () => {
    const poolData: PoolData = getTestPool()
    const pool: Pool = new Pool(poolData)
    const numbers: string[] = pool.getNumbers()
    expect(numbers).to.eql(['1', '2', '3'])
  })

  it('test getNextPerson excludes used numbers', () => {
    const poolData: PoolData = getTestPool()
    const pool: Pool = new Pool(poolData)

    expect(pool.getNextPerson(pool.getNumbers())).to.be.undefined

    expect(pool.getNextPerson(['1', '2'])).to.deep.equal({
      name: 'Bill',
      number: '3',
      address: 'The Street'
    })
    expect(pool.getNextPerson(['1', '3'])).to.deep.equal({
      name: 'Alice',
      number: '2',
      address: 'The Road'
    })
    const randomNumber = pool.getNextPerson(['1'])!.number
    expect(randomNumber).to.be.oneOf(['2', '3'])
  })

  it('test getNextPerson excludes used numbers with duplicate number pool', () => {
    const poolData: PoolData = getTestPoolWithDuplicateNumbers()
    const pool: Pool = new Pool(poolData)

    expect(pool.getNextPerson(pool.getNumbers())).to.be.undefined
    expect(pool.getNextPerson(['1'])).to.be.undefined
  })

  it('test getNextPerson excludes used numbers and caller', () => {
    const poolData: PoolData = getTestPool()
    const pool: Pool = new Pool(poolData)

    expect(pool.getNextPerson(['1', '2'], '3')).to.be.undefined
    expect(pool.getNextPerson(['1'], '3')).to.deep.equal({
      name: 'Alice',
      number: '2',
      address: 'The Road'
    })
  })

  it('test builder', () => {
    const builder: PoolBuilder = new PoolBuilder()
    const pool: Pool = builder
      .withNumber('+447766999999')
      .withCommunityName('Our Community')
      .withMessages({
        intro: 'Intro',
        next: 'Next',
        voice: 'man',
        screen: 'Screen'
      })
      .withPeople([
        {address: 'The Street', name: 'John', number: '+447766111111'}
      ])
      .build()
    expect(pool).to.be.instanceOf(Pool)
  })
})
