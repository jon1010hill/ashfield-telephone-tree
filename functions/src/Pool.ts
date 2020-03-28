import {
  PoolData,
  Message,
  Person,
  DEFAULT_RING_TIMEOUT,
  DEFAULT_MAX_CALL_LENGTH
} from './types'
// TODO consistent nomenclature
export class Pool {
  private data: PoolData
  private id?: string

  constructor(data: PoolData, id?: string) {
    this.data = data
    this.id = id
  }

  getId() {
    return this.id
  }

  getCommunityName(): string {
    return this.data.communityName
  }

  getNumbers(): string[] {
    return this.data.people.map((person: Person) => person.number)
  }

  getVoice(): string {
    return this.data.messages.voice
  }

  getBespokeMessagesForPerson(person: Person): Message {
    return {
      intro: this.data.messages.intro
        .replace('{NAME}', this.getCommunityName())
        .replace('{PERSON}', person.name)
        .replace('{STREET}', person.address),
      next: this.data.messages.next
        .replace('{PERSON}', person.name)
        .replace('{STREET}', person.address),
      voice: this.data.messages.voice,
      screen: this.data.messages.screen
    }
  }

  getMaxCallDuration(): number {
    return this.data.maxCallDuration
      ? this.data.maxCallDuration
      : DEFAULT_MAX_CALL_LENGTH
  }

  getScreenMessage(): string {
    return this.data.messages.screen
  }

  getRingTimeOut(): number {
    return this.data.ringTimeout ? this.data.ringTimeout : DEFAULT_RING_TIMEOUT
  }

  getInboundNumber(): string {
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

  getData(): PoolData {
    return {
      ...this.data
    }
  }
}

export class PoolBuilder implements Partial<PoolData> {
  communityName?: string
  number?: string
  ringTimeout?: number = 5
  maxCallDuration?: number
  messages?: Message
  people?: Person[]
  withCommunityName(
    communityName: string
  ): this & Pick<PoolData, 'communityName'> {
    return Object.assign(this, {communityName})
  }
  // tslint:disable-next-line: variable-name
  withNumber(number: string): this & Pick<PoolData, 'number'> {
    return Object.assign(this, {number})
  }
  withRingTimeout(
    ringTimeout: number
  ): this & Required<Pick<PoolData, 'ringTimeout'>> {
    return Object.assign(this, {ringTimeout})
  }
  withMaxCallDuration(
    maxCallDuration: number
  ): this & Pick<PoolData, 'maxCallDuration'> {
    return Object.assign(this, {maxCallDuration})
  }
  withMessages(messages: Message): this & Pick<PoolData, 'messages'> {
    return Object.assign(this, {messages})
  }
  withPeople(people: Person[]): this & Pick<PoolData, 'people'> {
    return Object.assign(this, {people})
  }
  build(this: PoolData): Pool {
    return new Pool(Object.assign(this))
  }
}
