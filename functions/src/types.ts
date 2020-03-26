import * as db from './data/data.json'
import {JSONFilePoolRepository} from './JSONFilePoolRepository'
import {InboundCallMapper} from './InboundCallMapper'
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
  IPoolRepository: new JSONFilePoolRepository(APP_DATA),
  CallHandler: new CallHandler(),
  InboundCallMapper: new InboundCallMapper(),
  get TwimlCallMapper() {
    return new TwimlIncomingCallDataMapper(this.InboundCallMapper)
  }
}
