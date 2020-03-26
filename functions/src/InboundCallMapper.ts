import googleLibphonenumber from 'google-libphonenumber'
import {IDataMapper} from './IDataMapper'

export type InboundCallData = {
  readonly from: string
  readonly to: string
  readonly called: string
  readonly numbersPreviouslyDialled: string[]
}

export class InboundCallMapper implements IDataMapper<InboundCallData> {
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
    const fromNumber = phoneUtil.parse(data.from)
    const toNumber = phoneUtil.parse(data.to)
    const calledNumber = phoneUtil.parse(data.called)

    return (
      typeof data === 'object' &&
      Array.isArray(data.numbersPreviouslyDialled) &&
      phoneUtil.isValidNumberForRegion(fromNumber, region) &&
      phoneUtil.isValidNumberForRegion(toNumber, region) &&
      phoneUtil.isValidNumberForRegion(calledNumber, region)
    )
  }
}
