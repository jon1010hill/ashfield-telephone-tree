import {toFirestore} from './toFirestore'
import * as admin from 'firebase-admin'
import {PoolData} from './types'
import {IPoolRepository} from './IPoolRepository'
import {Pool} from './Pool'
export class FirestorePoolRepository implements IPoolRepository {
  private readonly db: admin.firestore.Firestore
  private readonly col: admin.firestore.CollectionReference

  constructor(db: admin.firestore.Firestore) {
    this.db = db
    this.col = this.db.collection('Pool')
  }

  async findByNumberCalled(calledNumber: string): Promise<Pool> {
    const queryRef = this.col.where('number', '==', calledNumber)
    const snapshot: admin.firestore.QuerySnapshot = await queryRef.get()
    if (snapshot.empty) {
      throw new Error('Pool does not exist')
    }
    if (snapshot.docs.length > 1) {
      throw new Error('Duplicate data error')
    }
    const data: admin.firestore.DocumentData = snapshot.docs[0].data
    return new Pool(data as PoolData)
  }

  async create(entity: PoolData): Promise<PoolData> {
    console.log('create Pool entity')

    const now = admin.firestore.Timestamp.now()

    const firestoreDoc = toFirestore({
      ...entity,
      createdAt: now,
      updatedAt: now,
      version: 0
    })

    await this.col.doc().create(firestoreDoc)
    return firestoreDoc as PoolData
  }
}
