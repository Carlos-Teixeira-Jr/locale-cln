import { IPropertyCard } from './PropertyCard';

const base: IPropertyCard = {
  prices: '545,00',
  description: 'Cobertura duplex no pedacinho mais privilegiado da Saúde! A cobertura se divide em dois pavimentos, tendo seu acesso pelo piso inferior, que abriga a sala, terraço, cozinha e área',
  bedrooms: '3',
  bathrooms: '2',
  parking_spaces: '2',
  images: [
    'https://resizedimgs.zapimoveis.com.br/fit-in/800x360/named.images.sp/c597abf7c30ed2c25f4f8cadb59dd29d/cobertura-com-3-quartos-a-venda-199m-no-saude-sao-paulo.jpg',
    'https://resizedimgs.zapimoveis.com.br/fit-in/800x360/named.images.sp/9024d217306efc93d026d12e24cda163/cobertura-com-3-quartos-a-venda-199m-no-saude-sao-paulo.jpg',
    'https://resizedimgs.zapimoveis.com.br/fit-in/800x360/named.images.sp/61d8848a22b7639f83c3aa5789154119/cobertura-com-3-quartos-a-venda-199m-no-saude-sao-paulo.jpg',
    'https://resizedimgs.zapimoveis.com.br/fit-in/800x360/named.images.sp/14d0a1422a18c0324c6f8c4174006e85/cobertura-com-3-quartos-a-venda-199m-no-saude-sao-paulo.jpg',
  ],
  location: 'Pelotas, RS - Rua Francisco Lopez, nº 246',
  id: 0
};

export const mockPropertyCardProps = {
  base,
};
