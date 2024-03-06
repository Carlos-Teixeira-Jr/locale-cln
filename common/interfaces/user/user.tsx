import { ProfilePicture } from '../images/profilePicture';
import { IAddress } from '../property/propertyData';

export type User = {
  _id: string;
  username: string;
  cpf: string;
  email: string;
  address: IAddress;
  picture: string;
};

export interface IUserDataComponent {
  username: string;
  email: string;
  cpf: string;
  cellPhone: string;
  phone: string;
  wppNumber: string | undefined;
  picture: ProfilePicture;
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
  picture?: any;
}

export interface IUserDataComponentErrors {
  [key: string]: string;
  username: string;
  email: string;
  cpf: string;
  cellPhone?: any;
  phone?: any;
  picture?: any;
}
