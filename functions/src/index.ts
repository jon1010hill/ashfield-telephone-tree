import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {TwimlDialer} from './TwimlDialer'
import {Pool} from './Pool'
import {POOL, Person} from './types'
import {parseQueryStringToArray, getNextActionUrl} from './util'
// tslint:disable-next-line: import-name

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
  resp.header('Content-Type', 'text/xml')

  // todo extract out this logic
  const pool = new Pool(POOL)
  const numbersUsed: string[] = parseQueryStringToArray(req)
  console.log(`NUMBERS  ${numbersUsed}`)
  const nextPerson: Person | undefined = pool.getNextPerson(numbersUsed)

  if (!nextPerson) {
    console.log('Noone lef to Dial!')
    resp.status(200).send(new TwimlDialer().emptyResponse())
  } else {
    console.log('Found next number to dial')
    const actionUrl: string = getNextActionUrl(
      req,
      nextPerson ? nextPerson.number : undefined
    )

    console.log(`Next Action Url ${actionUrl}`)

    const twiml = new TwimlDialer().dialNext(
      pool,
      nextPerson,
      numbersUsed,
      actionUrl
    )
    console.log(twiml)
    resp.status(200).send(twiml.toString())
  }
})

// function handleCallStatus(status: string, numbersDialled: string) {
//   console.log(status)
//   switch (status) {
//     case 'no-answer':
//   }
// }

exports.ashfield = functions.region(REGION).https.onRequest(app)
