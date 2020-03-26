import {BeginCallSequence} from './command/types'
import {Pool} from './Pool'
import {TwimlVoiceResponseFactory} from './TwimlVoiceResponseFactory'
import {IPoolRepository} from './IPoolRepository'
export class CallHandler {
  private readonly poolRepo: IPoolRepository
  constructor(poolRepo: IPoolRepository) {
    this.poolRepo = poolRepo
  }
  incomingVoiceCall(command: BeginCallSequence): string {
    console.log('handle incomingVoiceCall', command)
    const pool: Pool = this.poolRepo.findByNumberDialled(command.data.called)

    const factory = new TwimlVoiceResponseFactory(pool, command.data.from)
    const response = factory.createNextResponse(
      command.data.numbersPreviouslyDialled
    )
    console.log('Response: ', response)
    return response
  }
}
