import googleLibphonenumber from 'google-libphonenumber'
import {IDataMapper} from './IDataMapper'

export type IncomingCallData = {
  readonly from: string
  readonly to: string
  readonly called: string
  readonly numbersPreviouslyDialled: string[]
}

export class IncomingCallDataMapper implements IDataMapper<IncomingCallData> {
  fromUnknown(data: any): IncomingCallData {
    if (this.isValid(data)) {
      return data
    }
    throw Error('data is not IncomingCallData')
  }
  isValid(data: any): data is IncomingCallData {
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
