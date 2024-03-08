import { IAddress, IMetadata, IPrices, ISize, announcementSubtype, announcementType, propSubtype, propType } from "./propertyData"

export type AddressErrors = {
  zipCode: string
  number: string
}

export interface ISizeErrors {
  width: string
  height: string
  area: string
}

export interface IPricesErrors {
  type: string;
  value: string;
}

export interface IEditPropertyData {
  id: string
  adType: announcementType
  adSubtype: string
  propertyType: string
  propertySubtype: string
  address: IAddress
  description: string
  metadata: IMetadata[]
  images?: string[]
  size: ISize
  tags: string[]
  condominiumTags: string[]
  prices: IPrices[]
  youtubeLink: string
}

export interface IEditPropertyErrors {
  address: AddressErrors
  description: string
  images: string
  size: ISizeErrors
  prices: IPricesErrors
}

export interface IEditPropertyMainFeatures {
  _id: string
  adType: announcementType
  adSubtype: announcementSubtype
  propertyType: propType | string
  propertySubtype: propSubtype | string
  description: string
  size: ISize
  propertyValue: string
  condominium: boolean
  condominiumValue: string
  iptu: boolean
  iptuValue: string
  metadata: IMetadata[]
}