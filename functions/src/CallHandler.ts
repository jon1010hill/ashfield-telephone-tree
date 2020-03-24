import {BeginCallSequence} from './command/types'
import {Pool} from './Pool'
import {POOL_REPO} from './types'
// import {TwimlVoiceController} from './TwimlVoiceControler'
export class CallHandler {
  inboundVoiceCall(command: BeginCallSequence) {
    const pool: Pool | undefined = POOL_REPO.findByNumberDialled(
      command.data.called
    )
    if (!pool) {
      throw new Error(`No pool found for command ${command}`)
    }
    // const voiceController = new TwimlVoiceController(pool, command.data.called)

    return ''
  }
}
