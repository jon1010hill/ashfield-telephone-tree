import 'mocha'
import {expect} from 'chai'
import {InboundCallMapper} from './InboundCallMapper'
import {InboundCallData} from './TwimlncomingCallDataMapper'
describe('data mapping and validation tests', () => {
  it('test valid UK numbers do not throw error', () => {
    const unknown: InboundCallData = {
      from: '+447766238372',
      to: '+447766238372',
      called: '+447766238372',
      numbersPreviouslyDialled: []
    }
    expect(new InboundCallMapper().fromUnknown(unknown)).does.not.throw
  })
  it('test undefined numbersPreviouslyDialled throws error', () => {
    const unknown: Omit<InboundCallData, 'numbersPreviouslyDialled'> = {
      from: '+447766111222',
      to: '+447766111222',
      called: '+447766111222'
    }
    expect(() => new InboundCallMapper().fromUnknown(unknown)).throw(
      'data is not InboundCallData'
    )
  })
})
