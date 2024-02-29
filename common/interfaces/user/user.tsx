import { IAddress } from '../property/propertyData';

export type User = {
  _id: string;
  username: string;
  cpf: string;
  email: string;
  address: IAddress;
  profilePicture: string;
};

export interface IUserDataComponent {
  username: string;
  email: string;
  cpf: string;
  cellPhone: string;
  phone: string;
  wppNumber: string | undefined;
  profilePicture: string;
}

export interface IUserData extends IUserDataComponent {
  address: IAddress;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  cpf: string;
  address: IAddress;
  profilePicture?: any;
}

export interface IUserDataComponentErrors {
  [key: string]: string;
  username: string;
  email: string;
  cpf: string;
  cellPhone?: any;
  phone?: any;
  profilePicture?: any;
}
