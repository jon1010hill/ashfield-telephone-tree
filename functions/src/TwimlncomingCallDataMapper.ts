import {IDataMapper} from './IDataMapper'
import * as twimlInboundCallData from './twilioIncomingCallData.json'
import {
  IncomingCallDataMapper,
  IncomingCallData
} from './IncomingCallDataMapper'
export const SAMPLE_TWILIO_DATA = twimlInboundCallData
export type TwimlIncomingCalData = typeof twimlInboundCallData

export type TwimlIncomingCallData = {
  readonly from: string
  readonly to: string
  readonly called: string
  readonly numbersPreviouslyCalled: string[]
}

export class TwimlIncomingCallDataMapper
  implements IDataMapper<TwimlIncomingCalData> {
  private incomingCallDataMapper: IncomingCallDataMapper
  constructor(incomingCallDataMapper: IncomingCallDataMapper) {
    this.incomingCallDataMapper = incomingCallDataMapper
  }
  fromUnknownToIncomingCallData(
    data: any,
    numbersPreviouslyCalled: string[]
  ): IncomingCallData {
    const twimlData = this.fromUnknown(data)
    return this.incomingCallDataMapper.fromUnknown({
      numbersPreviouslyCalled,
      from: twimlData.From,
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
