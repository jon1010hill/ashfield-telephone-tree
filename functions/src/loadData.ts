import * as admin from 'firebase-admin'
import {FirestorePoolRepository} from './FirestorePoolRepository'
import {PoolDataLoader} from './PoolDataLoader'
import {API_DATA} from './types'
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: API_DATA.dbUri
})
const dataLoader = new PoolDataLoader()
async function loadFromJson() {
  await dataLoader.loadFromJson(new FirestorePoolRepository(admin.firestore()))
}
loadFromJson()
  .then(() => console.log('Done'))
  .catch(e => console.error(e))
