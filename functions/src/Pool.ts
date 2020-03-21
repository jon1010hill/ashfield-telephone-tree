import {PoolData, Person} from './types'

export class Pool {
  private data: PoolData

  constructor(data: PoolData) {
    this.data = data
  }

  getNumbers(): string[] {
    return this.data.people.map(person => person.number)
  }

  getNextPerson(usedNumbers: string[]): Person | undefined {
    const filtered = this.data.people.filter(
      person => !usedNumbers.includes(person.number)
    )

    return filtered[Math.floor(Math.random() * filtered.length)]
  }
}
