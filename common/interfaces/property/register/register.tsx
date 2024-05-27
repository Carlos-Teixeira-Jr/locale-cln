import { ProfilePicture } from '../../images/profilePicture';

import {
  IAddress,
  IMetadata,
  IPrices,
  ISize,
  announcementSubtype,
  announcementType,
  propSubtype,
  propType,
} from '../propertyData';

export interface IRegisterMainFeatures {
  adType: announcementType;
  adSubtype: announcementSubtype;
  propertyType: propType;
  propertySubtype: propSubtype;
  description: string;
  metadata: IMetadata[];
  size: ISize;
  propertyValue: string;
  condominium: boolean;
  iptu: boolean;
  condominiumValue: string;
  iptuValue: string;
}

export interface IRegisterPropertyData_Step1 {
  adType: announcementType;
  adSubtype: announcementSubtype;
  address: IAddress;
  propertyType: propType;
  propertySubtype: propSubtype;
  description: string;
  metadata: IMetadata[];
  size: ISize;
  prices: IPrices[];
  condominium: boolean;
  tags: string[]
}

export interface IRegisterPropertyData_Step2 {
  images: string[];
  tags: string[];
  condominiumTags: string[];
  youtubeLink: string;
}

export interface IRegisterPropertyData_Step3 {
  username: string;
  picture: ProfilePicture;
  email: string;
  cpf: string;
  cellPhone: string;
  phone: string;
  wwpNumber: string;
  zipCode: string;
  city: string;
  uf: string;
  streetName: string;
  streetNumber: string;
  propertyAddress: IAddress;
  geolocation: number[];
  plan: string;
  isPlanFree: boolean;
}
export interface IGeolocation {
  type: string
  coordinates: number[]
}

export interface ICreateProperty_propertyData {
  adType: announcementType;
  adSubtype: string;
  propertyType: string;
  propertySubtype: string;
  address: IAddress;
  description: string;
  metadata: IMetadata[];
  geolocation: IGeolocation;
  ownerInfo: {
    name: string;
    phone: string;
    cellPhone: string
    picture: ProfilePicture;
    wwpNumber: string;
  };
  size: ISize;
  tags: string[];
  condominiumTags: string[];
  prices: IPrices[];
  youtubeLink: string;
  highlighted: boolean;
}

export interface ICreateProperty_userData {
  _id: string;
  username: string;
  email: string;
  address: IAddress;
  cpf: string;
  picture: ProfilePicture;
}
