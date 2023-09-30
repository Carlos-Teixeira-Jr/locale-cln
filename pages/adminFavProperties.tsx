import Pagination from '../components/atoms/pagination/pagination';
import PropertyCard from '../components/molecules/cards/propertyCard/PropertyCard';
import { NextPageWithLayout } from './page';

const AdminFavProperties: NextPageWithLayout = () => {
  return (
    <>
      {/**Admin Header */}
      <div className="flex flex-col items-center mb-5">
        <h1 className="font-bold text-quaternary text-4xl md:text-5xl mr-20 md:mr-96 mb-5 mt-14">
          Imóveis Favoritos
        </h1>
        <Pagination />
        <div className="flex flex-col md:flex-row gap-20 my-10">
          <PropertyCard
            id={0}
            price={'3500,00'}
            description={
              'Descrição da casa vai por aqui até finalizar o espaço. após finalizar...'
            }
            images={[
              'https://resizedimgs.zapimoveis.com.br/fit-in/800x360/named.images.sp/9acc2f073223b6f86053c857ab5660eb/apartamento-com-4-quartos-a-venda-144m-no-barra-da-tijuca-rio-de-janeiro.jpg',
              'https://resizedimgs.zapimoveis.com.br/fit-in/800x360/named.images.sp/a12568b7110b8c42e04a69c739edeeed/apartamento-com-4-quartos-a-venda-144m-no-barra-da-tijuca-rio-de-janeiro.jpg',
            ]}
            location={'Pelotas, RS - enderoço aqui, oq estiver'}
            favorited={true}
          />
          <PropertyCard
            id={0}
            price={'3500,00'}
            description={
              'Descrição da casa vai por aqui até finalizar o espaço. após finalizar...'
            }
            images={[
              'https://resizedimgs.zapimoveis.com.br/fit-in/800x360/named.images.sp/9acc2f073223b6f86053c857ab5660eb/apartamento-com-4-quartos-a-venda-144m-no-barra-da-tijuca-rio-de-janeiro.jpg',
              'https://resizedimgs.zapimoveis.com.br/fit-in/800x360/named.images.sp/a12568b7110b8c42e04a69c739edeeed/apartamento-com-4-quartos-a-venda-144m-no-barra-da-tijuca-rio-de-janeiro.jpg',
            ]}
            location={'Pelotas, RS - enderoço aqui, oq estiver'}
            favorited={true}
          />
          <PropertyCard
            id={0}
            price={'3500,00'}
            description={
              'Descrição da casa vai por aqui até finalizar o espaço. após finalizar...'
            }
            images={[
              'https://resizedimgs.zapimoveis.com.br/fit-in/800x360/named.images.sp/9acc2f073223b6f86053c857ab5660eb/apartamento-com-4-quartos-a-venda-144m-no-barra-da-tijuca-rio-de-janeiro.jpg',
              'https://resizedimgs.zapimoveis.com.br/fit-in/800x360/named.images.sp/a12568b7110b8c42e04a69c739edeeed/apartamento-com-4-quartos-a-venda-144m-no-barra-da-tijuca-rio-de-janeiro.jpg',
            ]}
            location={'Pelotas, RS - enderoço aqui, oq estiver'}
            favorited={true}
          />
        </div>
        <Pagination />
      </div>
    </>
  );
};

export default AdminFavProperties;
