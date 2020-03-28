import * as db from './data/data.json'
import {IncomingCallDataMapper} from './IncomingCallDataMapper'
import {TwimlIncomingCallDataMapper} from './TwimlncomingCallDataMapper'
import {CallHandler} from './CallHandler'
import {UrlBuilder} from './HttpRequestUtil'
import * as admin from 'firebase-admin'
import {FirestorePoolRepository} from './FirestorePoolRepository'

export const DEFAULT_RING_TIMEOUT = 5
export const DEFAULT_MAX_CALL_LENGTH = 600

export type Api = {
  baseUri: string
}

export type Person = {
  readonly name: string
  readonly number: string
  readonly address: string
}

export type Message = {
  readonly intro: string
  readonly next: string
  readonly screen: string
  readonly voice: string
}

export type PoolData = {
  readonly ringTimeout?: number
  readonly maxCallDuration?: number
  readonly communityName: string
  readonly number: string
  readonly messages: Message
  readonly people: Person[]
}

export type AppData = {api: Api; pools: PoolData[]}
export const APP_DATA: typeof db = db
export const API_DATA: typeof db.api = db.api

export const SERVICE_LOCATOR = {
  get IPoolRepository() {
    return new FirestorePoolRepository(admin.firestore())
  },
  getCallHandler(urlBuilder: UrlBuilder) {
    // todo review
    return new CallHandler(this.IPoolRepository, urlBuilder)
  },
  get IncomingCallDataMapper() {
    return new IncomingCallDataMapper()
  },
  get TwimlIncomingCallDataMapper() {
    return new TwimlIncomingCallDataMapper(this.IncomingCallDataMapper)
  }
}
