import * as db from './data/data.json'
import * as twilioIncomingCallData from './twilioIncomingCallData.json'
import googleLibphonenumber from 'google-libphonenumber'
export type AppData = typeof db
export const APP_DATA: AppData = db
export const API_DATA: Api = db.api
const dataSample = db.pools[0]
export type PoolData = typeof dataSample
export type Person = typeof dataSample.people[0]
export type Messages = typeof dataSample.messages
export type Api = typeof db.api

export type TwilioInboundCallData = typeof twilioIncomingCallData

/* Inboound Call Data type and guard */
export type InboundCallData = {
  readonly from: string
  readonly to: string
  readonly called: string
}

export function isValidInboundCallData(data: any): data is InboundCallData {
  const phoneUtil = googleLibphonenumber.PhoneNumberUtil.getInstance()
  // uk only support for now
  const region = phoneUtil.getRegionCodeForCountryCode(44)

  return (
    typeof data === 'object' &&
    phoneUtil.isValidNumberForRegion(phoneUtil.parse(data.from, region)) &&
    phoneUtil.isValidNumberForRegion(phoneUtil.parse(data.to), region) &&
    phoneUtil.isValidNumberForRegion(phoneUtil.parse(data.called), region)
  )
}
