import googleLibphonenumber from 'google-libphonenumber'
import {IDataMapper} from './IDataMapper'

export type IncomingCallData = {
  readonly from: string
  readonly called: string
  readonly numbersPreviouslyCalled: string[]
  readonly to?: string // do we need this?
  readonly dialStatus?: string // todo narrow this
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
    const calledNumber = phoneUtil.parse(data.called)

    return (
      typeof data === 'object' &&
      Array.isArray(data.numbersPreviouslyCalled) &&
      (typeof data.dialStatus === 'string' ||
        typeof data.dialStatus === 'undefined') &&
      phoneUtil.isValidNumberForRegion(fromNumber, region) &&
      phoneUtil.isValidNumberForRegion(calledNumber, region)
    )
  }
}
