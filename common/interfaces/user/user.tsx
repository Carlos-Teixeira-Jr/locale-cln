import { IAddress } from "../property/propertyData"

export type User = {
  _id: string 
  username: string
  cpf: string
  email: string
  address: IAddress
}

export interface IUserDataComponent {
  username: string,
  email: string,
  cpf: string,
  cellPhone: string,
  phone: string,
}

export interface IUserData extends  IUserDataComponent {
  [key: string]: string | IAddress,
  address: IAddress
}

export interface IUser {
  id: string
  username: string
  email: string
  cpf: string
  address: IAddress
}

export interface IUserDataComponentErrors {
  [key: string]: string
  username: string
  email: string
  cpf: string
  cellPhone: string
}