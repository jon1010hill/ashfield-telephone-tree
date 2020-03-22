import * as db from './data.json'
export const API_DATA = db.api
export const POOL_DATA = db.pool
export type PoolData = typeof POOL_DATA
export type Person = typeof POOL_DATA.people[0]
export type Messages = typeof POOL_DATA.messages
export type Api = typeof db.api
