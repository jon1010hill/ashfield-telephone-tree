import {IDataMapper} from './IDataMapper'
import * as twimlInboundCallData from './twilioIncomingCallData.json'
import {IncomingCallDataMapper} from './IncomingCallDataMapper'
export const SAMPLE_TWILIO_DATA = twimlInboundCallData
export type TwimlIncomingCalData = typeof twimlInboundCallData

export type InboundCallData = {
  readonly from: string
  readonly to: string
  readonly called: string
  readonly numbersPreviouslyDialled: string[]
}

export class TwimlIncomingCallDataMapper
  implements IDataMapper<TwimlIncomingCalData> {
  private inboundCallMapper: IncomingCallDataMapper
  constructor(inboundCallDataMapper: IncomingCallDataMapper) {
    this.inboundCallMapper = inboundCallDataMapper
  }
  fromUnknownToInboundCallData(
    data: any,
    numbersPreviouslyDialled: string[]
  ): InboundCallData {
    const twimlData = this.fromUnknown(data)
    return this.inboundCallMapper.fromUnknown({
      numbersPreviouslyDialled,
      from: twimlData.From,
      to: twimlData.To,
      called: twimlData.Called
    })
  }

  fromUnknown(data: any): TwimlIncomingCalData {
    if (this.isValid(data)) {
      return data
    }
    throw Error('data is not TwimlIncomingCallData')
  }
  isValid(data: any): data is TwimlIncomingCalData {
    if (!(typeof data === 'object')) {
      return false
    }

    console.log(Object.keys(data))
    for (const key of Object.keys(SAMPLE_TWILIO_DATA)) {
      if (twimlInboundCallData.hasOwnProperty(key)) {
        if (key === 'default') {
          // todo what is the key called default?
          continue
        }
        if (!data.hasOwnProperty(key)) {
          return false
        }
        const coercedKey = key as keyof TwimlIncomingCalData
        if (typeof data[key] !== typeof SAMPLE_TWILIO_DATA[coercedKey]) {
          return false
        }
      }
    }
    return true
  }
}
