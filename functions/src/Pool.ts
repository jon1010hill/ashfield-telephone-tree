import {PoolData, Messages, Person} from './types'
// TODO consistent nomenclature
export class Pool {
  private data: PoolData

  constructor(data: PoolData) {
    this.data = data
  }

  getCommunityName(): string {
    return this.data.communityName
  }

  getNumbers(): string[] {
    return this.data.people.map((person: Person) => person.number)
  }

  getVoice(): string {
    return this.data.voice
  }

  getBespokeMessagesForPerson(person: Person): Messages {
    return {
      intro: this.data.messages.intro
        .replace('{NAME}', this.getCommunityName())
        .replace('{PERSON}', person.name)
        .replace('{STREET}', person.address),
      next: this.data.messages.next
        .replace('{PERSON}', person.name)
        .replace('{STREET}', person.address)
    }
  }

  getMaxCallDuration(): number {
    return this.data.maxCallDuration
  }

  getScreenMessage(): string {
    return this.data.screen
  }

  getRingTimeOut(): number {
    return this.data.ringTimeout
  }

  getInboudNumber(): string {
    return this.data.number
  }

  getNextPerson(usedNumbers: string[], caller?: string): Person | undefined {
    console.log(`getNextPerson called and filter ${usedNumbers}`)
    // todo check usedNumbers exist in pool
    const filtered = this.data.people.filter(
      (person: Person) =>
        !usedNumbers.includes(person.number) && caller !== person.number
    )
    return filtered[Math.floor(Math.random() * filtered.length)]
  }
}
