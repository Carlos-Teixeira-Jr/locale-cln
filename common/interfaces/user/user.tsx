import { IAddress } from '../property/propertyData';

export type User = {
  _id: string;
  username: string;
  cpf: string;
  email: string;
  address: IAddress;
};

export interface IUserDataComponent {
  username: string;
  email: string;
  cpf: string;
  cellPhone: string;
  phone: string;
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
}

export interface IUserDataComponentErrors {
  username: string;
  email: string;
  cpf: string;
  cellPhone?: string;
  phone?: string;
}

