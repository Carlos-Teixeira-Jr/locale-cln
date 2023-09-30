import { IMessage } from "../message/messages"
import { IData } from "../property/propertyData"

export interface IOwnerProperties {
  count: number
  docs: IData[]
  totalPages: number
  messages: IMessage[]
}