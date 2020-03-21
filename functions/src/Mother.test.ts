import {PoolData} from './types'

export function getTestPool(): PoolData {
  return {
    ringTimeout: 8,
    maxCallDuration: 600,
    name: 'Smith Street',
    number: '+44xxxxxxxxxx',
    voice: 'Poly.Brian',
    messages: {
      intro:
        'Hello. You have reached {NAME} community line. We will try to connect you to {PERSON} on {STREET}}',
      next: 'We are now trying to connect you to {PERSON} on {STREET}'
    },
    people: [
      {
        name: 'Jon',
        number: '1',
        address: 'The Lane'
      },
      {
        name: 'Alice',
        number: '2',
        address: 'The Road'
      },
      {
        name: 'Bill',
        number: '3',
        address: 'The Street'
      }
    ]
  }
}
export function getTestPoolWithDuplicateNumbers(): PoolData {
  return {
    ringTimeout: 8,
    maxCallDuration: 600,
    name: 'Smith Street',
    number: '+44xxxxxxxxxx',
    voice: 'Poly.Brian',
    messages: {
      intro:
        'Hello. You have reached {NAME} community line. We will try to connect you to {PERSON} on {STREET}}',
      next: 'We are now trying to connect you to {PERSON} on {STREET}'
    },
    people: [
      {
        name: 'Jon',
        number: '1',
        address: 'The Lane'
      },
      {
        name: 'Alice',
        number: '1',
        address: 'The Road'
      },
      {
        name: 'Bill',
        number: '1',
        address: 'The Street'
      }
    ]
  }
}
