import * as express from 'express'
import * as cors from 'cors'
// import * as twilio from 'twilio'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
const REGION = 'europe-west1'
const app = express()
app.use(cors({origin: true}))
admin.initializeApp()

app.post('/', async (_req, resp) => {
  console.log('app.post', resp)
  resp.status(200)
})
exports.ashfield = functions.region(REGION).https.onRequest(app)
