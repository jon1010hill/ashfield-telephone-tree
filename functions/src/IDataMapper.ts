export interface IDataMapper<T> {
  fromUnknown(data: any): T
  isValid(data: T): data is T
}
