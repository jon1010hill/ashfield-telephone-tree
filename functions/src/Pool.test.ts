import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import 'mocha'
import {PoolData} from './types'
import {getTestPool} from './Mother.test'
import {Pool} from './Pool'

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
    console.log(pool.getNextPerson(['1', '2']))
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
})
