import {IDataMapper} from './IDataMapper'
import * as twimlInboundCallData from './twilioIncomingCallData.json'
import {INBOUND_CALL_DATA_MAPPER} from './index'
export const SAMPLE_TWILIO_DATA = twimlInboundCallData
export type TwimlInboundCallData = typeof twimlInboundCallData

export type InboundCallData = {
  readonly from: string
  readonly to: string
  readonly called: string
  readonly numbersPreviouslyDialled: string[]
}

export class TwimlIncomingCallDataMapper
  implements IDataMapper<TwimlInboundCallData> {
  fromUnknownToInboundCallData(
    data: any,
    numbersPreviouslyDialled: string[]
  ): InboundCallData {
    const twimlData = this.fromUnknown(data)
    return INBOUND_CALL_DATA_MAPPER.fromUnknown({
      numbersPreviouslyDialled,
      from: twimlData.From,
      to: twimlData.To,
      called: twimlData.Called
    })
  }

  fromUnknown(data: any): TwimlInboundCallData {
    if (this.isValid(data)) {
      return data
    }
    throw Error('data is not TwimlInboundCallData')
  }
  isValid(data: any): data is TwimlInboundCallData {
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
        const coercedKey = key as keyof TwimlInboundCallData
        if (typeof data[key] !== typeof SAMPLE_TWILIO_DATA[coercedKey]) {
          return false
        }
      }
    }
    return true
  }
}

export const TWIML_DATA_MAPPER = new TwimlIncomingCallDataMapper()
