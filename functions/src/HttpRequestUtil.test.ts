import * as chai from 'chai'
import sinonChai = require('sinon-chai')
import {mockReq} from 'sinon-express-mock'
chai.use(sinonChai)
import 'mocha'

import {HttpRequestUtil} from './HttpRequestUtil'

const expect = chai.expect

const request = mockReq({
  protocol: 'http',
  originalUrl: '/voice',
  host: 'localhost',
  get(_key: string) {
    return 'localhost'
  }
})

const httpUtil = new HttpRequestUtil(request)
describe('util function tests', () => {
  beforeEach(() => {})
  afterEach(() => {})

  it('test getQueryString from array of numbers is encdoed csv string', () => {
    const str = httpUtil.getQueryStringFromArray(['+44111111', '+44222222'])
    expect('%2B44111111%2C%2B44222222').to.equal(str)
  })
  it('test getUrl ', () => {
    const str = httpUtil.getCurrentUrl()
    console.log(str)
    expect('http://localhost/voice').to.equal(str)
  })
  it('test getNextActionUrl appends number to query string', () => {
    const str = httpUtil.getNextActionUrl('+44999999')
    console.log(str)
    expect('http://localhost/voice?numbersTried=%2B44999999').to.equal(str)
  })
  it('test getQueryString ', () => {
    const httpUtil = new HttpRequestUtil(
      mockReq({
        protocol: 'http',
        originalUrl: '/voice',
        host: 'localhost',
        get(_key: string) {
          return 'localhost'
        },
        query: {
          numbersTried: '+44111111,+44222222'
        }
      })
    )
    const arr = httpUtil.parseQueryStringToArray()
    expect(arr).to.deep.equal(['+44111111', '+44222222'])
  })
})
