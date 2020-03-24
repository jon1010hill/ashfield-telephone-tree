import {Pool} from './Pool'
import * as twilio from 'twilio'
import VoiceResponse = require('twilio/lib/twiml/VoiceResponse')
import {Person} from './types'
export class TwimlDialer {
  screenResponse(pool: Pool): VoiceResponse {
    const twiml = new twilio.twiml.VoiceResponse()
    twiml.say(
      {voice: 'woman'},
      pool.getScreenMessage().replace('{NAME}', pool.getCommunityName())
    )
    return twiml
  }
  emptyResponse() {
    return new twilio.twiml.VoiceResponse().toString()
  }

  say(s: string) {
    const twiml = new twilio.twiml.VoiceResponse()
    twiml.say(s)
    return twiml
  }
  dialNext(
    pool: Pool,
    personToDial: Person,
    usedNumbers: string[],
    _callScreenUrl: string,
    actionUrl?: string
  ): string {
    console.log(`Dial next called ${usedNumbers.length}`)
    const twiml = new twilio.twiml.VoiceResponse()

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
      )
      twiml.dial(options).number(personToDial.number)
    } else {
      console.log('YES WE HAVE PREVIOUS NUMBERS')
      twiml.say(
        // Intro message
        {voice: pool.getVoice() as VoiceResponse.SayVoice},
        pool.getBespokeMessagesForPerson(personToDial).next
      )
      twiml.dial(options).number(personToDial.number)
    }
    return twiml.toString()
  }
}
