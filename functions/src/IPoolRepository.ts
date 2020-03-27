import {Pool} from './Pool'

/**
 * Represents the contract of a repository which provides pools of phone numbers to call, given a
 * specific community number.
 */
export interface IPoolRepository {
  findByNumberCalled(calledNumber: string): Promise<Pool> | Pool
}
