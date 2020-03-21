import {Pool} from './Pool'
import * as twilio from 'twilio'
import VoiceResponse = require('twilio/lib/twiml/VoiceResponse')
import {Person} from './types'
export class TwimlDialer {
  screenResponse(pool: Pool) {
    return new twilio.twiml.VoiceResponse().say(
      {voice: 'woman'},
      pool.getScreenMessage()
    )
  }
  emptyResponse() {
    return new twilio.twiml.VoiceResponse().toString()
  }
  dialNext(
    pool: Pool,
    personToDial: Person,
    usedNumbers: string[],
    calledUrl: string,
    actionUrl?: string
  ): string {
    console.log(`Dial next called ${usedNumbers.length}`)
    const twiml = new twilio.twiml.VoiceResponse()

    const callScreenUrl = `${calledUrl}/screen`
    if (!personToDial) {
      console.log('No more people to dial')
      return twiml.toString() // TODO, reached end of pool
    }

    const options = {
      timeout: pool.getRingTimeOut(),
      timeLimit: pool.getMaxCallDuration(),
      action: actionUrl,
      answerOnBridge: true // todo test this with and without
    }

    if (usedNumbers.length === 0) {
      console.log('NO PREVIOUS NUMBERS')
      // first call attempt
      twiml.say(
        // Intro message
        {voice: pool.getVoice() as VoiceResponse.SayVoice},
        pool.getBespokeMessagesForPerson(personToDial).intro
      ) // todo variable substitution
      twiml.dial(options).number({url: callScreenUrl}, personToDial.number)
    } else {
      console.log('YES WE HAVE PREVIOUS NUMBERS')
      twiml.say(
        // Intro message
        {voice: pool.getVoice() as VoiceResponse.SayVoice},
        pool.getBespokeMessagesForPerson(personToDial).next
      )
      twiml.dial(options).number({url: callScreenUrl}, personToDial.number)
    }
    return twiml.toString()
  }
}
