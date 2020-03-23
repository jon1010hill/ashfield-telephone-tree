import * as db from './data/data.json'

export type AppData = typeof db[0]
export const APP_DATA: AppData[] = db
const dataSample: AppData = db[0]
export type PoolData = typeof dataSample.pool
export type Person = typeof dataSample.pool.people[0]
export type Messages = typeof dataSample.pool.messages
export type Api = typeof dataSample.api
