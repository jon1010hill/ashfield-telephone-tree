import {PoolData, Person} from './types'
// import VoiceResponse = require('twilio/lib/twiml/VoiceResponse')

export class Dialer {
  constructor() {}

  nextPerson(pool: PoolData, usedNumbers: string[]): Person {
    const filtered = pool.people.filter(
      person => !usedNumbers.includes(person.number)
    )
    return filtered[Math.floor(Math.random() * filtered.length)]
  }
}
