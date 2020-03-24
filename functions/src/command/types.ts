import {InboundCallData} from '../types'
export type Command = {
  readonly createdAt: Date
  readonly data: Record<string, string | number>
}
export type BeginCallSequence = Command & {
  readonly data: InboundCallData
}
