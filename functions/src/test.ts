import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import chaiHttp from 'chai-http';
import app from './index';
chai.use(chaiAsPromised)
import 'mocha'
import 
const expect = chai.expect

describe('Sample tests', () => {
  before(() => {
    expect(true).to.be.true
  })

  afterEach(() => {})

  it('test something', async () => {})
})
