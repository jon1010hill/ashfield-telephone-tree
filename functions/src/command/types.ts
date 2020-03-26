import {IncomingCallData} from '../IncomingCallDataMapper'

export type Command = {
  readonly createdAt: Date
  readonly data: Record<string, string | number | object | string[]>
}
export type BeginCallSequence = Command & {
  readonly data: IncomingCallData
}
