import * as chai from 'chai'
import 'mocha'
import { Pool } from './Pool'
import { getIncomingCallData, getTestPool } from './Mother.test'
import { TwimlVoiceResponseFactory } from './TwimlVoiceResponseFactory'
import { HttpRequestUtil } from './HttpRequestUtil'
import { mockReq } from 'sinon-express-mock'
import * as sinon from "ts-sinon";

const expect = chai.expect
const stubObject = sinon.stubObject;

const CALLER = "1"

const response1 = '<?xml version="1.0" encoding="UTF-8"?><Response><Say>Hello. You have reached Test Street community line. We will try to connect you to Alice on Smith Street</Say><Dial action="http://localhost/voice?numbersTried=2" answerOnBridge="true"><Number>2</Number></Dial></Response>'
const response2 = '<?xml version="1.0" encoding="UTF-8"?><Response><Say>We are now trying to connect you to Bob on Smith Street</Say><Dial action="http://localhost/voice?numbersTried=2%2C3" answerOnBridge="true"><Number>3</Number></Dial></Response>'


describe('TwimlVoiceResponseFactory tests', () => {
  beforeEach(() => {})
  afterEach(() => {})

  it("should ring Alice", () => {
    const request = mockReq({
        protocol: 'http',
        originalUrl: '/voice',
        host: 'localhost',
        get(_key: string) {
          return 'localhost'
        }
      })
    var alice = {
        name: "Alice",
        number: "2",
        address: "Smith Street"
    }
    var pool = stubObject<Pool>(new Pool(getTestPool("Test community","1")))
    pool.getNextPerson.returns(alice)
    pool.getBespokeMessagesForPerson.returns({
        intro: "Hello. You have reached Test Street community line. We will try to connect you to Alice on Smith Street",
        next: "We are now trying to connect you to Alice on Smith Street"
    })

    var underTest = new TwimlVoiceResponseFactory(pool, 
        getIncomingCallData(CALLER, pool.getInboundNumber(), [], "no-answer"), 
        new HttpRequestUtil(request))

    var response: string = underTest.createNextResponse()
    expect(response).to.equal(response1)
  })

  it("should ring Bob, if Alice didn't answer", () => {
    const request = mockReq({
        protocol: 'http',
        originalUrl: '/voice?numbersTried=2',
        host: 'localhost',
        get(_key: string) {
          return 'localhost'
        }
      })
    var triedNumbers = ["2"]
    var bob = {
        name: "Bob",
        number: "3",
        address: "Smith Street"
    }
    var pool = stubObject<Pool>(new Pool(getTestPool("Test community","1")))
    pool.getNextPerson.returns(bob)
    pool.getBespokeMessagesForPerson.returns({
        intro: "Hello. You have reached Test Street community line. We will try to connect you to Bob on Smith Street",
        next: "We are now trying to connect you to Bob on Smith Street"
    })

    var underTest = new TwimlVoiceResponseFactory(pool, 
        getIncomingCallData(CALLER, pool.getInboundNumber(), triedNumbers, "no-answer"), 
        new HttpRequestUtil(request))

    var response: string = underTest.createNextResponse()
    expect(response).to.equal(response2)
  })
})
