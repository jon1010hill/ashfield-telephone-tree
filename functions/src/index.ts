import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as querystring from 'querystring'
import * as twilio from 'twilio'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
// tslint:disable-next-line: import-name
import VoiceResponse = require('twilio/lib/twiml/VoiceResponse')
import {POOL} from './types'

const REGION = 'europe-west1'
const app = express()
app.use(bodyParser.json())
admin.initializeApp()
/*
TODO
play a message before answer to the Receiver  (I think we use the URL element in Dial to send the receiver to some twiml)
Pool functions for randomising
Query string or dial parameters to hold used number states
deal with DialStatus states
SMS: IN / OUT
Deploy to firebase
*/
app.post('/voice', (req: express.Request, resp: express.Response) => {
  const thisUrl = getCurrentUrl(req)
  const body = req.body
  const from = body.From
  const numbersTriedStr = req.query.numbersTried
    ? `${req.query.numbersTried},${from}`
    : from
  const queryString = querystring.escape(numbersTriedStr)
  //  handleCallStatus(body.DialCallStatus)
  console.log(`Received request at + ${thisUrl}`)
  console.log(numbersTriedStr)
  const actionUrl = `${thisUrl}?numbersTried=${queryString}`
  console.log(actionUrl)
  const twiml = new twilio.twiml.VoiceResponse()

  const options = {
    timeout: POOL.ringTimeout,
    timeLimit: POOL.maxCallDuration,
    action: actionUrl

    // todo twilio dialer client errors with bad callerId, why? sip?
    // todo action: NO_ANSWER
    // todo we need to handle DialCallStatus
  }
  twiml.say({voice: POOL.voice as VoiceResponse.SayVoice}, POOL.messages.intro) // todo variable substitution

  twiml.dial(options).number({url: '/screen'}, POOL.people[0].number)

  resp.header('Content-Type', 'text/xml')
  resp.send(twiml.toString())
  resp.status(200)
})

function getCurrentUrl(req: express.Request) {
  // tslint:disable-next-line: prefer-template
  return req.protocol + '://' + req.get('host') + req.originalUrl
}

// function handleCallStatus(status: string, numbersDialled: string) {
//   console.log(status)
//   switch (status) {
//     case 'no-answer':
//   }
// }

exports.ashfield = functions.region(REGION).https.onRequest(app)
