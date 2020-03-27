import {BeginCallSequence} from './command/types'
import {Pool} from './Pool'
import {TwimlVoiceResponseFactory} from './TwimlVoiceResponseFactory'
import {IPoolRepository} from './IPoolRepository'
import {UrlBuilder} from './HttpRequestUtil'
export class CallHandler {
  private readonly poolRepo: IPoolRepository
  private readonly urlBuilder: UrlBuilder
  constructor(poolRepo: IPoolRepository, urlBuilder: UrlBuilder) {
    this.poolRepo = poolRepo
    this.urlBuilder = urlBuilder
  }
  async incomingVoiceCall(command: BeginCallSequence): Promise<string> {
    console.log('handle incomingVoiceCall', command)
    const pool: Pool = await this.poolRepo.findByNumberCalled(
      command.data.called
    )

    const factory = new TwimlVoiceResponseFactory(
      pool,
      command.data,
      this.urlBuilder
    )
    const response = factory.createNextResponse()
    console.log('Response: ', response)
    return response
  }
}
