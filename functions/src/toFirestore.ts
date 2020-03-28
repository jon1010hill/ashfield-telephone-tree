import * as admin from 'firebase-admin'
export type FirestoreValue =
  | null
  | string
  | number
  | boolean
  | admin.firestore.DocumentData
  | FirestoreArray
  | admin.firestore.Timestamp

export interface FirestoreArray extends Array<FirestoreValue> {}

export const toFirestore = (value: any): admin.firestore.DocumentData => {
  return convert(value) as admin.firestore.DocumentData
}
const convert = (value: any): FirestoreValue | undefined => {
  if (value === null) return value
  switch (typeof value) {
    case 'symbol':
      return {}
    case 'object':
      if (value instanceof Date) {
        return admin.firestore.Timestamp.fromDate(value)
      }
      // map over arrays, convert dont drop elemets
      if (Array.isArray(value)) {
        return value.map(v => convert(v)).filter(e => e !== undefined)
      }
      const res: admin.firestore.DocumentData = {}
      Object.keys(value).forEach((k: string) => {
        const j = convert(value[k])
        // ignore any undefined values
        if (j !== undefined) res[k] = j
      })

      return res
    default:
      return value
  }
}
