import googleLibphonenumber from 'google-libphonenumber'
import {IDataMapper} from './IDataMapper'
import {TwimlInboundCallData} from './TwimlncomingCallDataMapper'

export type InboundCallData = {
  readonly from: string
  readonly to: string
  readonly called: string
  readonly numbersPreviouslyDialled: string[]
}

export class InboundCallMapper implements IDataMapper<InboundCallData> {
  fromTwimlData(
    data: TwimlInboundCallData,
    numbersPreviouslyDialled: string[]
  ): InboundCallData {
    return this.fromUnknown({
      numbersPreviouslyDialled,
      from: data.From,
      to: data.To,
      called: data.Called
    })
  }
  fromUnknown(data: any): InboundCallData {
    if (this.isValid(data)) {
      return data
    }
    throw Error('data is not InboundCallData')
  }
  isValid(data: any): data is InboundCallData {
    const phoneUtil = googleLibphonenumber.PhoneNumberUtil.getInstance()
    // uk only support for now
    const region = phoneUtil.getRegionCodeForCountryCode(44)
    return (
      typeof data === 'object' &&
      Array.isArray(data.numbersPreviouslyDialled) &&
      phoneUtil.isValidNumberForRegion(phoneUtil.parse(data.from, region)) &&
      phoneUtil.isValidNumberForRegion(phoneUtil.parse(data.to), region) &&
      phoneUtil.isValidNumberForRegion(phoneUtil.parse(data.called), region)
    )
  }
}

export const INBOUND_CALL_MAPPER = new InboundCallMapper()
