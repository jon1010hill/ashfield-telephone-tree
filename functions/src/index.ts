import express from 'express'
import * as bodyParser from 'body-parser'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {TwilioUtil} from './TwilioUtil'
import {Pool} from './Pool'
import {
  // parseQueryStringToArray,
  // getNextActionUrl,
  getCurrentUrl,
  getCallScreenUrl
} from './util'
import {TwilioInboundCallData} from './types'
import {CallHandler} from './CallHandler'
import {BeginCallSequence} from './command/types'
// tslint:disable-next-line: import-name

const REGION = 'europe-west1'
const app = express()
app.use(bodyParser.json())
admin.initializeApp()

/**
 * Endpoint that returns call screening message to play to the receiver before
 * the call connects
 *
 */
// app.post('/voice/screen', (req: express.Request, resp: express.Response) => {
//   resp.header('Content-Type', 'text/xml')
//   console.log(`URL Called ${getCurrentUrl(req)}`)
//   const twiml = new TwimlDialer().screenResponse(new Pool(APP_DATA))
//   resp.status(200).send(twiml.toString())
// })

/**
 * General purpose endpoint for receiving twilio voice webhooks
 */
app.post('/voice', (req: express.Request, resp: express.Response) => {
  resp.header('Content-Type', 'text/xml')

  const command: BeginCallSequence = {
    createdAt: new Date(),
    data: new TwilioUtil().toInboundCallData(req.body as TwilioInboundCallData)
  }

  resp.status(200).send(new CallHandler().inboundVoiceCall(command))
})

// function shouldTryNext(status: string) {
//   console.log(status)
//   switch (status) {
//     case undefined:
//       return true
//     case 'no-answer':
//       return true
//     case 'failed':
//       return true
//     case 'busy':
//       return true
//     case 'completed':
//       return false
//     case 'answered':
//       return false
//     default:
//       return false
//   }
// }

exports.ashfield = functions.region(REGION).https.onRequest(app)
