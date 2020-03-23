import * as db from './data/data.json'

export type AppData = typeof db.pools[0]
export const APP_DATA: AppData[] = db.pools[0]
export const API_DATA: Api = db.api
const dataSample: AppData = db.pools[0]
export type PoolData = typeof dataSample
export type Person = typeof dataSample.people[0]
export type Messages = typeof dataSample.messages
export type Api = typeof db.api
