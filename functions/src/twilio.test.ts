import 'mocha'
import {expect} from 'chai'
import {TwilioUtil} from './TwilioUtil'

describe('twilio data parsing and validation tests', () => {
  it('test valid UK numbers do not throw error', () => {
    const unknown: any = {
      from: '+447766111222',
      to: '+447766111222',
      called: '+447766111222'
    }
    expect(new TwilioUtil().toInboundCallData(unknown)).to.not.throw
  })
})
