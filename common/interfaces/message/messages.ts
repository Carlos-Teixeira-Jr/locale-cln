import { IData } from "../property/propertyData"


export interface IMessage {
  _id: string
  name: string
  phone: string
  email: string
  message: string
  isRead: boolean
  propertyId: string
  owner_id: string
}

export interface IMessagesByProperty {
  messages: {
    docs: IMessage[]
    count: number
    totalPages: number
  }
  property: IData
}

export interface IMessagesByOwner {
  docs: IMessage[]
  properties: IData[]
  totalPages: number
  page: number
}