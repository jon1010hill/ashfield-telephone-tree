import {PoolData, Api} from './types'
import {IncomingCallData} from './IncomingCallDataMapper'

export function getApi(): Api {
  return {
    baseUri: 'http://localhost'
  }
}
export function getTestPool(
  communityName?: string,
  callerNumber?: string
): PoolData {
  return {
    ringTimeout: 6,
    maxCallDuration: 600,
    communityName: communityName ? communityName : 'Smith Street',
    number: callerNumber ? callerNumber : '+44xxxxxxxxxx',

    messages: {
      intro:
        'Hello. You have reached {NAME} community line. We will try to connect you to {PERSON} on {STREET}}',
      next: 'We are now trying to connect you to {PERSON} on {STREET}',
      screen: 'You are about to receive a call',
      voice: 'Poly.Brian'
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
    ringTimeout: 7,
    maxCallDuration: 600,
    communityName: 'Smith Street',
    number: '+44xxxxxxxxxx',

    messages: {
      intro:
        'Hello. You have reached {NAME} community line. We will try to connect you to {PERSON} on {STREET}}',
      next: 'We are now trying to connect you to {PERSON} on {STREET}',
      voice: 'Poly.Brian',
      screen: 'You are about to receive a call'
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
export function getIncomingCallData(
  from: string,
  called: string,
  numbersPreviouslyCalled: string[],
  dialStatus: string
): IncomingCallData {
  return {
    from,
    called,
    numbersPreviouslyCalled,
    dialStatus
  }
}
