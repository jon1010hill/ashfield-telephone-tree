import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import 'mocha'
const expect = chai.expect

describe('Sample tests', () => {
  before(() => {
    expect(true).to.be.true
  })

  afterEach(() => {})

  it('test something', async () => {})
})
