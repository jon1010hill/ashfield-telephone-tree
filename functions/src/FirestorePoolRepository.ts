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
    const snap: admin.firestore.DocumentSnapshot = snapshot.docs[0]
    const data = snap.data()

    return new Pool(data as PoolData, snap.id)
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

  async updateOrCreate(entity: PoolData): Promise<PoolData> {
    const persistedEntity: Pool = await this.findByNumberCalled(entity.number)
    const id = persistedEntity.getId()
    if (!id) {
      return this.create(entity)
    }
    const firestorePartial: admin.firestore.DocumentData = {
      ...entity,
      updatedAt: admin.firestore.Timestamp.now()
    }
    delete firestorePartial['createdAt']
    console.log('updating partial doc', firestorePartial)

    await this.col.doc(id).update(firestorePartial)
    return entity
  }
}
