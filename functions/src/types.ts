import * as db from './data/data.json' // todo source this from URL
import {JSONFilePoolRepository} from './JSONFilePoolRepository'
import {IncomingCallDataMapper} from './IncomingCallDataMapper'
import {TwimlIncomingCallDataMapper} from './TwimlncomingCallDataMapper'
import {CallHandler} from './CallHandler'
export type AppData = typeof db
export const APP_DATA: AppData = db
export const API_DATA: Api = db.api

const dataSample = db.pools[0]
export type PoolData = typeof dataSample
export type Person = typeof dataSample.people[0]
export type Messages = typeof dataSample.messages
export type Api = typeof db.api

export const SERVICE_LOCATOR = {
  get IPoolRepository() {
    return new JSONFilePoolRepository(APP_DATA)
  },
  get CallHandler() {
    return new CallHandler(this.IPoolRepository)
  },
  get IncomingCallDataMapper() {
    return new IncomingCallDataMapper()
  },
  get TwimlIncomingCallDataMapper() {
    return new TwimlIncomingCallDataMapper(this.IncomingCallDataMapper)
  }
}
