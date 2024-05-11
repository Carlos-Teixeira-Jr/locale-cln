import { ProfilePicture } from '../images/profilePicture';
import { IAddress } from '../property/propertyData';

export type User = {
  _id: string;
  username: string;
  cpf: string;
  email: string;
  address: IAddress;
  picture: string;
  phone: string
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
  picture?: string;
}

export type IUserDataComponentErrors = {
  [key: string]: string | undefined;
  username: string;
  email: string;
  cpf: string;
  cellPhone?: string | undefined;
  phone?: string | undefined;
  picture?: string | undefined;
}
