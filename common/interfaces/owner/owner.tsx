import { User } from "../user/user"

export interface ICreditCardInfo {
  creditCardBrand: string
  creditCardNumber: string
  creditCardToken: string
}

type Owner = {
  _id: string
  adCredits: number
  cellPhone: string
  phone: string
  plan: string
  creditCardInfo: ICreditCardInfo
  customerId: string
}

export interface IOwnerData {
  user: User,
  owner?: Owner,
}

export interface IOwner {
  id: string
  ownername: string
  userId: string
  phones: string[]
  adCredits: number
}