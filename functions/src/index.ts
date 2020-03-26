import express from 'express'
import * as bodyParser from 'body-parser'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {BeginCallSequence} from './command/types'
import {HttpRequestUtil} from './HttpRequestUtil'
import {InboundCallData} from './TwimlncomingCallDataMapper'
import {SERVICE_LOCATOR} from './types'
const REGION = 'europe-west1'
const app = express()
app.use(bodyParser.json())
admin.initializeApp()

/**
 * General purpose endpoint for receiving twilio voice webhooks
 */
app.post('/voice', (req: express.Request, resp: express.Response) => {
  console.log('Received POST request from Twilio')
  resp.header('Content-Type', 'text/xml')

  const httpUtil = new HttpRequestUtil()

  const numbersPreviouslyDialled: string[] = httpUtil.parseQueryStringToArray(
    req
  )

  const inboundCallData: InboundCallData = SERVICE_LOCATOR.TwimlIncomingCallDataMapper.fromUnknownToInboundCallData(
    req.body,
    numbersPreviouslyDialled
  ) // can throw Exception

  const command: BeginCallSequence = {
    createdAt: new Date(),
    data: inboundCallData
  }
  resp.status(200).send(SERVICE_LOCATOR.CallHandler.incomingVoiceCall(command))
})

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
