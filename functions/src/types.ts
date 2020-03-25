import * as db from './data/data.json'
export type AppData = typeof db
export const APP_DATA: AppData = db
export const API_DATA: Api = db.api

const dataSample = db.pools[0]
export type PoolData = typeof dataSample
export type Person = typeof dataSample.people[0]
export type Messages = typeof dataSample.messages
export type Api = typeof db.api
