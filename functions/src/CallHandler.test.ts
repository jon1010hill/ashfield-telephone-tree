import * as chai from 'chai'
import sinonChai = require('sinon-chai')
import chaiXml from 'chai-xml'
import {mockReq} from 'sinon-express-mock'
chai.use(sinonChai)
chai.use(chaiXml)
import 'mocha'

import {Api, PoolData} from './types'
import {HttpRequestUtil} from './HttpRequestUtil'
import {JSONFilePoolRepository} from './JSONFilePoolRepository'
import {getTestPool, getApi} from './Mother.test'
import {CallHandler} from './CallHandler'
import {BeginCallSequence} from './command/types'
import xmlParser from 'xml-parser'
const expect = chai.expect

const request = mockReq({
  protocol: 'http',
  originalUrl: '/voice',
  host: 'localhost',
  get(_key: string) {
    return 'localhost'
  }
})
describe('CallHandler service tests', () => {
  it('test no previous numbers called and no dialStatus returns ...', async () => {
    const api: Api = getApi()
    const pool: PoolData = getTestPool('Project A', '01234')

    const callHandler = new CallHandler(
      new JSONFilePoolRepository({api, pools: [pool]}),
      new HttpRequestUtil(request)
    )

    const command: BeginCallSequence = {
      createdAt: new Date(),
      data: {
        called: pool.number,
        from: '447766222222',
        numbersPreviouslyCalled: []
      }
    }
    const response = await callHandler.incomingVoiceCall(command)
    const result = xmlParser(response)

    expect(response).xml.to.be.valid()
    expect(result.root.name).to.equal('Response')
  })
})
