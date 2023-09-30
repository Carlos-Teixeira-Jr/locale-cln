import { IAddress, IMetadata, IPrices, ISize } from "../propertyData"


export interface IStoredData {
  adType: string
  adSubtype: string
  propertyType: string
  propertySubtype: string
  address: IAddress
  tags: string[]
  condominium: boolean
  condominiumTags?: string[]
  description: string
  images: string[]
  metadata: IMetadata
  prices: IPrices
  size: ISize
  youtubeLink: string
}