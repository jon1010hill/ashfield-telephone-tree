import * as express from 'express'
import * as twilio from 'twilio'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
const db = require('./data.json') // todo, can we do better: import? types?
const pool = db.pool
const REGION = 'europe-west1'
const app = express()
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
app.post('/voice', (_req, resp) => {
  const twiml = new twilio.twiml.VoiceResponse()

  const options = {
    timeout: pool.ringTimeout,
    timeLimit: pool.maxCallDuration

    // todo twilio dialer client errors with bad callerId, why? sip?
    // todo action: NO_ANSWER
    // todo we need to handle DialCallStatus
  }
  twiml.say({voice: pool.voice}, pool.messages.intro) // todo variable substitution

  twiml.dial(options, pool.people[0].number)

  resp.header('Content-Type', 'text/xml')
  resp.send(twiml.toString())
  resp.status(200)
})

exports.ashfield = functions.region(REGION).https.onRequest(app)
