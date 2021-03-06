import {Pool} from './Pool'
import {IVoiceResponseFactory, SayData, DialData} from './IVoiceResponseFactory'
import * as twilio from 'twilio'
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse'
import {Person, NO_ONE_LEFT_IN_POOL_MSG} from './types'
import {IncomingCallData} from './IncomingCallDataMapper'
import {UrlBuilder} from './HttpRequestUtil'
export class TwimlVoiceResponseFactory implements IVoiceResponseFactory {
  private readonly pool: Pool
  private readonly incomingCallData: IncomingCallData
  private readonly urlBuilder: UrlBuilder

  constructor(
    pool: Pool,
    incomingCallData: IncomingCallData,
    urlBuilder: UrlBuilder
  ) {
    this.pool = pool
    this.incomingCallData = incomingCallData
    this.urlBuilder = urlBuilder
  }

  private emptyResponse() {
    return new twilio.twiml.VoiceResponse().toString()
  }

  private say(data: SayData, twiml: VoiceResponse): VoiceResponse {
    twiml.say(
      // Intro message
      {voice: this.pool.getVoice() as VoiceResponse.SayVoice},
      data.message
    )
    return twiml
  }

  private dial(data: DialData, twiml: VoiceResponse): VoiceResponse {
    const options = {
      timeout: this.pool.getRingTimeOut(),
      timeLimit: this.pool.getMaxCallDuration(),
      action: data.actionUrl,
      answerOnBridge: true // todo test this with and without
    }
    twiml.dial(options).number(data.to)
    return twiml
  }

  createNextResponse(): string {
    let twiml = new twilio.twiml.VoiceResponse()
    const person: Person | undefined = this.pool.getNextPerson(
      this.incomingCallData.numbersPreviouslyCalled,
      this.incomingCallData.from
    )
    if (!this.shouldTryNext(this.incomingCallData.dialStatus)) {
      console.log(
        `DialCallStatus ${this.incomingCallData.dialStatus} prehibits next action`
      )
      return this.emptyResponse().toString()
    }

    if (!person) {
      console.log('No more people left in pool')
      return this.say(
        {
          message: NO_ONE_LEFT_IN_POOL_MSG,
          to: this.incomingCallData.from
        },
        twiml
      ).toString()
    }

    const messages = this.pool.getBespokeMessagesForPerson(person)
    const actionUrl = this.urlBuilder.getNextActionUrl(person.number)
    console.log(`Action URL: ${actionUrl}`)
    if (this.incomingCallData.numbersPreviouslyCalled.length === 0) {
      console.log(
        'No previous used numbers, this is the first person in the pool'
      )
      // first call attempt
      twiml = this.say(
        {
          message: messages.intro,
          to: person.number
        },
        twiml
      )
      //
      twiml = this.dial(
        {
          actionUrl,
          to: person.number
        },
        twiml
      )
      return twiml.toString()
    }
    console.log('Not first number in the pool')
    twiml = this.say(
      {
        message: messages.next,
        to: person.number
      },
      twiml
    )
    twiml = this.dial(
      {
        actionUrl,
        to: person.number
      },
      twiml
    )
    return twiml.toString()
  }

  shouldTryNext(status?: string) {
    switch (status) {
      case undefined:
        return true
      case 'no-answer':
        return true
      case 'failed':
        return true
      case 'busy':
        return true
      case 'completed':
        return false
      case 'answered':
        return false
      default:
        return false
    }
  }
}
