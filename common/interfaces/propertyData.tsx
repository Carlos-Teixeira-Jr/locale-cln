export type announcementType = 'comprar' | 'alugar';
export type announcementSubtype = 'comercial' | 'residencial';
export type propType =
  | 'apartamento'
  | 'casa'
  | 'casaDeCondominio'
  | 'casaDeBairro'
  | 'cobertura'
  | 'fazendaSitioChacara'
  | 'flat'
  | 'loteTerreno'
  | 'sobrado';
export type propSubtype =
  | 'padrao'
  | 'cobertura'
  | 'flat'
  | 'kitnetConjugado'
  | 'loft'
  | 'estudio';
export type tagsType =
  | 'bathroom'
  | 'bedroom'
  | 'parkingSpaces'
  | 'suites'
  | 'floors';

export enum PricesType {
  'diaria' = 'diaria',
  'mensal' = 'mensal',
  'semanal' = 'semanal',
  'IPTU' = 'IPTU',
  'venda' = 'venda',
  'condominio' = 'condominio',
}

export type metadataType =
  | 'bathroom'
  | 'garage'
  | 'bedroom'
  | 'dependencies'
  | 'suites';

export interface IAddress {
  zipCode: string;
  city: string;
  streetName: string;
  number: string;
  complement: string;
  neighborhood: string;
  uf: string
}
export interface IMetadata {
  type: metadataType;
  amount: number;
}
export interface IGeolocation {
  _id: string;
  type: string;
  coordinates: number[];
}

export interface IActivity {
  type: boolean;
}

export interface IOwnerInfo {
  name: string;
  phones: string[];
  creci?: string;
  email: string;
  cpf?: string;
}

export interface ISize {
  width: number;
  height: number;
  area: number;
}
export interface IPrices {
  type: PricesType;
  value: number;
}

export type planType = 'free' | 'basico' | 'localePlus' | '';

export interface IData {
  _id: string;
  adType: announcementType;
  adSubtype: announcementSubtype;
  propertyType: propType;
  propertySubtype: propSubtype;
  announcementCode: string;
  address: IAddress;
  description: string;
  metadata: IMetadata[];
  geolocation: IGeolocation;
  images: string[];
  isActive: IActivity;
  owner: string;
  ownerInfo: IOwnerInfo;
  size: ISize;
  tags: string[];
  condominiumTags: string[];
  prices: IPrices[];
  youtubeLink: string;
  plan: planType;
  highlighted: boolean;
  acceptFunding: boolean;
}

export type Data = {
  adType: announcementType;
  adSubtype: announcementSubtype;
  propertyType: propType;
  propertySubtype: propSubtype;
  announcementCode: string;
  address: IAddress;
  description: string;
  metadata: IMetadata[];
  geolocation: IGeolocation;
  images: string[];
  isActive: IActivity;
  owner: string;
  ownerInfo: IOwnerInfo;
  size: ISize;
  tags: string[];
  condominiumTags: string[];
  prices: IPrices[];
  youtubeLink: string;
  plan: planType;
  acceptFunding: boolean;
};

export interface IPropertyInfo {
  docs: IData[];
  page: number;
  totalCount: number;
}
