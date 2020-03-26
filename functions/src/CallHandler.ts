import {BeginCallSequence} from './command/types'
import {Pool} from './Pool'
import {IPoolRepository} from './IPoolRepository'
import {JSONFilePoolRepository} from './JSONFilePoolRepository'
import {APP_DATA} from './types'
export const POOL_REPO: IPoolRepository = new JSONFilePoolRepository(APP_DATA)
import {TwimlVoiceResponseFactory} from './TwimlVoiceResponseFactory'
export class CallHandler {
  inboundVoiceCall(command: BeginCallSequence): string {
    console.log('handle inboundVoiceCall', command)
    const pool: Pool = POOL_REPO.findByNumberDialled(command.data.called)

    const factory = new TwimlVoiceResponseFactory(pool, command.data.from)
    const response = factory.createNextResponse(
      command.data.numbersPreviouslyDialled
    )
    console.log('Response: ', response)
    return response
  }
}
