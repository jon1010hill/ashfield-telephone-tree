import {Pool} from './Pool'
import {VoiceController, SayData, DialData} from './VoiceController'
import * as twilio from 'twilio'
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse'
import {Person} from './types'
export class TwimlVoiceController implements VoiceController {
  private readonly pool: Pool
  private readonly caller: string

  constructor(pool: Pool, caller: string) {
    this.pool = pool
    this.caller = caller
  }

  private emptyResponse() {
    return new twilio.twiml.VoiceResponse().toString()
  }

  createSayInstruction(data: SayData): string {
    const twiml = new twilio.twiml.VoiceResponse()
    twiml.say(
      // Intro message
      {voice: this.pool.getVoice() as VoiceResponse.SayVoice},
      data.message
    )
    return twiml.toString()
  }

  createDialInstruction(data: DialData): string {
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

  createNextInstruction(usedNumbers: string[]): string {
    const person: Person | undefined = this.pool.getNextPerson(
      usedNumbers,
      this.caller
    )
    if (!person) {
      console.log('No more people left in pool')
      return this.emptyResponse().toString()
    }
    const messages = this.pool.getBespokeMessagesForPerson(person)
    const dialInstruction = this.createDialInstruction({to: person.number})

    if (usedNumbers.length === 0) {
      console.log('No previous used numbers, this is the first person the pool')
      // first call attempt
      const sayInstruction = this.createSayInstruction({
        message: messages.intro,
        to: person.number
      })
      //todo action url and screen url

      return sayInstruction + dialInstruction
    }
    console.log('Not first number in the pool')
    const sayInstruction = this.createSayInstruction({
      message: messages.next,
      to: person.number
    })
    return sayInstruction + dialInstruction
  }
}
