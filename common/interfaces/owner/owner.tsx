import { IAddress } from "../property/propertyData"
import { User } from "../user/user"


type Owner = {
  _id: string
  adCredits: number
  phones: string[]
  plan: string
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