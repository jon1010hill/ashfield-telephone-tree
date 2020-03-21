import * as db from './data.json'
export const POOL = db.pool
export type PoolData = typeof POOL
export type Person = typeof POOL.people[0]
export type Messages = typeof POOL.messages
