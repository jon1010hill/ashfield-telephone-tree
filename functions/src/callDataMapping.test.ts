import 'mocha'
import {expect} from 'chai'
import {
  InboundCallData,
  TwimlInboundCallData,
  SAMPLE_TWILIO_DATA
} from './TwimlncomingCallDataMapper'
import {SERVICE_LOCATOR} from './types'
describe('data mapping and validation tests', () => {
  it('test valid UK numbers do not throw error', () => {
    const unknown: InboundCallData = {
      from: '+447766222111',
      to: '+447766222111',
      called: '+447766222111',
      numbersPreviouslyDialled: []
    }
    expect(SERVICE_LOCATOR.InboundCallMapper.fromUnknown(unknown)).does.not
      .throw
  })
  it('test undefined numbersPreviouslyDialled throws error', () => {
    const unknown: Omit<InboundCallData, 'numbersPreviouslyDialled'> = {
      from: '+447766111222',
      to: '+447766111222',
      called: '+447766111222'
    }
    expect(() => SERVICE_LOCATOR.InboundCallMapper.fromUnknown(unknown)).throw(
      'data is not InboundCallData'
    )
  })
  it('test invalid number string throws error', () => {
    const unknown: InboundCallData = {
      from: '+447766111', // short
      to: '+447766111222',
      called: '+447766111222',
      numbersPreviouslyDialled: []
    }
    expect(() => SERVICE_LOCATOR.InboundCallMapper.fromUnknown(unknown)).throw(
      'data is not InboundCallData'
    )
  })

  it('test example twilio data does not throw error', () => {
    const unknown: TwimlInboundCallData = SAMPLE_TWILIO_DATA
    expect(SERVICE_LOCATOR.TwimlCallMapper.fromUnknown(unknown)).does.not.throw
  })
})
