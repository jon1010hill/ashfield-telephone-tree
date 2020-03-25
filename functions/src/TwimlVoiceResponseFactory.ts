import {Pool} from './Pool'
import {IVoiceResponseFactory, SayData, DialData} from './IVoiceResponseFactory'
import * as twilio from 'twilio'
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse'
import {Person} from './types'
export class TwimlVoiceResponseFactory implements IVoiceResponseFactory {
  private readonly pool: Pool
  private readonly caller: string

  constructor(pool: Pool, caller: string) {
    this.pool = pool
    this.caller = caller
  }

  private emptyResponse() {
    return new twilio.twiml.VoiceResponse().toString()
  }

  private say(data: SayData): string {
    const twiml = new twilio.twiml.VoiceResponse()
    twiml.say(
      // Intro message
      {voice: this.pool.getVoice() as VoiceResponse.SayVoice},
      data.message
    )
    return twiml.toString()
  }

  private dial(data: DialData): string {
    const twiml = new twilio.twiml.VoiceResponse()

    const options = {
      timeout: this.pool.getRingTimeOut(),
      timeLimit: this.pool.getMaxCallDuration(),
      action: data.actionUrl,
      answerOnBridge: true // todo test this with and without
    }
    twiml.dial(options).number(data.to)
    return twiml.toString()
  }

  createNextResponse(usedNumbers: string[]): string {
    const person: Person | undefined = this.pool.getNextPerson(
      usedNumbers,
      this.caller
    )
    if (!person) {
      console.log('No more people left in pool')
      return this.emptyResponse().toString()
    }
    const messages = this.pool.getBespokeMessagesForPerson(person)
    const dialInstruction = this.dial({to: person.number})

    if (usedNumbers.length === 0) {
      console.log('No previous used numbers, this is the first person the pool')
      // first call attempt
      const sayInstruction = this.say({
        message: messages.intro,
        to: person.number
      })
      //todo action url and screen url

      return sayInstruction + dialInstruction
    }
    console.log('Not first number in the pool')
    const sayInstruction = this.say({
      message: messages.next,
      to: person.number
    })
    return sayInstruction + dialInstruction
  }
}
