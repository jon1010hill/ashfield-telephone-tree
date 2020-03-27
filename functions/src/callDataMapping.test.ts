import 'mocha'
import {expect} from 'chai'
import {
  SAMPLE_TWILIO_DATA,
  TwimlIncomingCalData
} from './TwimlncomingCallDataMapper'
import {SERVICE_LOCATOR} from './types'
import {IncomingCallData} from './IncomingCallDataMapper'
describe('data mapping and validation tests', () => {
  it('test valid UK numbers do not throw error', () => {
    const unknown: IncomingCallData = {
      from: '+447766222111',
      to: '+447766222111',
      called: '+447766222111',
      numbersPreviouslyCalled: [],
      dialStatus: 'ringing'
    }
    expect(SERVICE_LOCATOR.IncomingCallDataMapper.fromUnknown(unknown)).does.not
      .throw
  })
  it('test undefined numbersPreviouslyCalled throws error', () => {
    const unknown: Omit<IncomingCallData, 'numbersPreviouslyCalled'> = {
      from: '+447766111222',
      to: '+447766111222',
      called: '+447766111222',
      dialStatus: 'ringing'
    }
    expect(() =>
      SERVICE_LOCATOR.IncomingCallDataMapper.fromUnknown(unknown)
    ).throw('data is not IncomingCallData')
  })
  it('test invalid number string throws error', () => {
    const unknown: IncomingCallData = {
      from: '+447766111', // short
      to: '+447766111222',
      called: '+447766111222',
      numbersPreviouslyCalled: [],
      dialStatus: 'ringing'
    }
    expect(() =>
      SERVICE_LOCATOR.IncomingCallDataMapper.fromUnknown(unknown)
    ).throw('data is not IncomingCallData')
  })

  it('test example twilio data does not throw error', () => {
    const unknown: TwimlIncomingCalData = SAMPLE_TWILIO_DATA
    expect(SERVICE_LOCATOR.TwimlIncomingCallDataMapper.fromUnknown(unknown))
      .does.not.throw
  })
})
