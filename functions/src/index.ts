import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {TwimlDialer} from './TwimlDialer'
import {Pool} from './Pool'
import {POOL, Person} from './types'
import {parseQueryStringToArray, getNextActionUrl, getCurrentUrl} from './util'
// tslint:disable-next-line: import-name

const REGION = 'europe-west1'
const app = express()
app.use(bodyParser.json())
admin.initializeApp()
/*
TODO
SMS: IN / OUT
Deploy to firebase
logging (simple call logs might be useful)
*/

app.post('/voice/screen', (_req: express.Request, resp: express.Response) => {
  resp.header('Content-Type', 'text/xml')
  const twiml = new TwimlDialer().screenResponse()
  resp.status(200).send(twiml.toString())
})

app.post('/voice', (req: express.Request, resp: express.Response) => {
  resp.header('Content-Type', 'text/xml')
  const dialCallStatus = req.body.DialCallStatus
  console.log(`URL Called ${getCurrentUrl(req)}`)
  console.log(`Dial Status ${dialCallStatus}`)
  // todo extract out this logic
  const pool = new Pool(POOL)
  const numbersUsed: string[] = parseQueryStringToArray(req)
  console.log(`NUMBERS  ${numbersUsed}`)
  const nextPerson: Person | undefined = pool.getNextPerson(numbersUsed)

  if (!nextPerson || !shouldTryNext(dialCallStatus)) {
    // TODO, say sorry no one available just now
    console.log('No one left to Dial!')
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
      getCurrentUrl(req),
      actionUrl
    )
    console.log(twiml)
    resp.status(200).send(twiml.toString())
  }
})

function shouldTryNext(status: string) {
  console.log(status)
  switch (status) {
    case undefined:
      return true
    case 'no-answer':
      return true
    case 'failed':
      return true
    case 'busy':
      return true
    case 'completed':
      return false
    case 'answered':
      return false
    default:
      return false
  }
}

exports.ashfield = functions.region(REGION).https.onRequest(app)
