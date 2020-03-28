import {expect} from 'chai'
import 'mocha'
import {toFirestore} from './toFirestore'
import {Timestamp} from '@google-cloud/firestore'

describe('toFirestore test', () => {
  it('test Date to Timestamp', async () => {
    const o: any = toFirestore({createdAt: new Date()})
    console.log(typeof o.createdAt)
    expect(o.createdAt instanceof Timestamp).to.be.true
  })

  it('test complex Object', async () => {
    const o = {
      a: undefined,
      b: null,
      c: new Date(),
      d: 1,
      e: [undefined],
      f: {a: undefined, b: null, c: new Date(), d: 1, e: [undefined]}
    }
    const dd: any = toFirestore(o)

    expect('a' in dd).to.be.false
    expect(dd['b']).to.be.null
    expect(dd['c']).to.be.instanceof(Timestamp)
    expect(dd['d']).to.eq(1)
    expect(dd['e']).to.be.instanceof(Array)
    expect(dd['e']).to.have.lengthOf(0)
    console.log(dd)
  })
})
