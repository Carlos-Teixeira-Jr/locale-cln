import { User } from '../user/user';

export interface ICreditCardInfo {
  creditCardBrand: string;
  creditCardNumber: string;
  creditCardToken: string;
}

export type CreditCardInfo = {
  creditCardBrand: string;
  creditCardNumber: string;
  creditCardToken: string
}

export type OwnerPaymentData = {
  cpfCnpj: string;
  customerId: string;
  subscriptionId: string;
  creditCardInfo: CreditCardInfo
}

type Owner = {
  _id: string;
  name: string;
  adCredits: number;
  highlightCredits: number;
  cellPhone: string;
  email: string;
  phone: string;
  wppNumber: string;
  plan: string;
  creditCardInfo: ICreditCardInfo;
  customerId: string;
  isNewCreditCard: boolean;
  newCreditCardData: any;
  picture: string;
  paymentData: OwnerPaymentData;
  userId: string
};

export interface IOwnerData {
  user: User;
  owner?: Owner;
}

export interface IOwner {
  _id: string;
  ownername: string;
  userId: string;
  phones: string[];
  email: string;
  adCredits: number;
  plan: string
  highlightCredits?: number
}
