import express from 'express'
import * as bodyParser from 'body-parser'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {BeginCallSequence} from './command/types'
import {HttpRequestUtil} from './HttpRequestUtil'
import {SERVICE_LOCATOR} from './types'
import {IncomingCallData} from './IncomingCallDataMapper'
import {FirestorePoolRepository} from './FirestorePoolRepository'
import {PoolDataLoader} from './PoolDataLoader'
const REGION = 'europe-west2'
const app = express()
app.use(bodyParser.json())
admin.initializeApp()

app.get('/admin', async (_req: express.Request, resp: express.Response) => {
  await new PoolDataLoader().loadSample(
    new FirestorePoolRepository(admin.firestore())
  )
  resp.status(200).send('OK')
})
/**
 * General purpose endpoint for receiving twilio voice webhooks
 */
app.post('/voice', async (req: express.Request, resp: express.Response) => {
  console.log('Received POST request from Twilio')
  resp.header('Content-Type', 'text/xml')
  const httpUtil = new HttpRequestUtil(req)
  console.log(`URL Called: ${httpUtil.getCurrentUrl()}`)

  const numbersPreviouslyCalled: string[] = httpUtil.parseQueryStringToArray()

  const incomingCallData: IncomingCallData = SERVICE_LOCATOR.TwimlIncomingCallDataMapper.fromUnknownToIncomingCallData(
    req.body,
    numbersPreviouslyCalled
  ) // can throw Exception

  const command: BeginCallSequence = {
    createdAt: new Date(),
    data: incomingCallData
  }
  resp
    .status(200)
    .send(
      await SERVICE_LOCATOR.getCallHandler(httpUtil).incomingVoiceCall(command)
    )
})

exports.ashfield = functions.region(REGION).https.onRequest(app)
