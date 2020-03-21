import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import sinonChai = require('sinon-chai')
import {mockReq} from 'sinon-express-mock'
chai.use(chaiAsPromised)
chai.use(sinonChai)
import 'mocha'

import {
  getQueryStringFromArray,
  getNextActionUrl,
  getCurrentUrl,
  parseQueryStringToArray
} from './util'
const expect = chai.expect

const request = mockReq({
  protocol: 'http',
  originalUrl: '/voice',
  get(_key: string) {
    return 'localhost'
  }
})
describe('util function tests', () => {
  beforeEach(() => {})
  afterEach(() => {})

  it('test getQueryString from array of numbers is encdoed csv string', () => {
    const str = getQueryStringFromArray(['+44111111', '+44222222'])
    expect('%2B44111111%2C%2B44222222').to.equal(str)
  })
  it('test getUrl ', () => {
    const str = getCurrentUrl(request)
    console.log(str)
    expect('http://localhost/voice').to.equal(str)
  })
  it('test getNextActionUrl appends number to query string', () => {
    const str = getNextActionUrl(request, '+44999999')
    console.log(str)
    expect('http://localhost/voice?numbersTried=%2B44999999').to.equal(str)
  })
  it('test getQueryString ', () => {
    const arr = parseQueryStringToArray(
      mockReq({
        protocol: 'http',
        originalUrl: '/voice',
        get(_key: string) {
          return 'localhost'
        },
        query: {
          numbersTried: '+44111111,+44222222'
        }
      })
    )
    expect(arr).to.deep.equal(['+44111111', '+44222222'])
  })
})
