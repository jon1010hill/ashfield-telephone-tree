import {BeginCallSequence} from './command/types'
import {Pool} from './Pool'
import {SERVICE_LOCATOR} from './types'
import {TwimlVoiceResponseFactory} from './TwimlVoiceResponseFactory'
export class CallHandler {
  inboundVoiceCall(command: BeginCallSequence): string {
    console.log('handle inboundVoiceCall', command)
    const pool: Pool = SERVICE_LOCATOR.IPoolRepository.findByNumberDialled(
      command.data.called
    )

    const factory = new TwimlVoiceResponseFactory(pool, command.data.from)
    const response = factory.createNextResponse(
      command.data.numbersPreviouslyDialled
    )
    console.log('Response: ', response)
    return response
  }
}
