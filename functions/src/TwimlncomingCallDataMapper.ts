import {IDataMapper} from './IDataMapper'
import * as twimlInboundCallData from './twilioIncomingCallData.json'

export type TwimlInboundCallData = typeof twimlInboundCallData

export type InboundCallData = {
  readonly from: string
  readonly to: string
  readonly called: string
  readonly numbersPreviouslyDialled: string[]
}

export class TwimlIncomingCallDataMapper
  implements IDataMapper<TwimlInboundCallData> {
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
    for (const key of Object.keys(twimlInboundCallData)) {
      if (twimlInboundCallData.hasOwnProperty(key)) {
        if (!data.hasOwnProperty(key)) {
          return false
        }
        const coercedKey = key as keyof TwimlInboundCallData
        if (typeof data[key] !== typeof twimlInboundCallData[coercedKey]) {
          return false
        }
      }
    }
    return false
  }
}

export const INBOUND_CALL_MAPPER = new TwimlIncomingCallDataMapper()
